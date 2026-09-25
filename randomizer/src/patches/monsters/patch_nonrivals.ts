/**
 * Patches non-rival monsters in the game, so they can be fully randomized.
 * Non-rival monsters live in TABLE_B of MR3.dat
 */

import { IsoSource } from "../..";
import { read_UInt16 } from "../../utils/isoUtility";
import { MONSTER_NAME_FIELD_LENGTH } from "../../utils/nameUtility";
import { getMonsterNames } from "../../utils/nameUtility";
import {
  MF3_DAT,
  TABLE_B_START,
  TABLE_B_OFFSET_TABLE,
  TABLE_B_LIF_OFFSET,
  TABLE_B_POW_OFFSET,
  TABLE_B_INT_OFFSET,
  TABLE_B_DEF_OFFSET,
  TABLE_B_SPD_OFFSET,
} from "../../addresses/MR3_DAT";
import { encodeMr3Text } from "../../utils/textUtility";
import { IsoPatch } from "../../types";
import _ from "lodash";

/**
 * The number of non-rival monsters in the game.
 */
const NON_RIVAL_MONSTER_COUNT = 125;

/**
 * The size of each record in TABLE_B of MR3.dat.
 * Note that even though Monsters can have lots of data - such as growth rates and personality types - the non-rival monsters
 * only have enough information to create a basic monster that you fight.
 * Anything non-combat related is not included, which makes sense.
 */
const TABLE_B_RECORD_SIZE = 0x58;

/**
 * Randomizes the non-rival monsters you encounter across the game's tournaments.
 * Does NOT randomize rival monsters, wild monsters, or story-related monsters.
 */
export async function randomizeNonRivalMonsters(
  source: IsoSource,
  logger?: (message: string) => void,
): Promise<IsoPatch[]> {
  logger?.("Randomizing non-rival monsters...");

  // Step 1. Select a random list of monster names
  const names = getMonsterNames(NON_RIVAL_MONSTER_COUNT);

  // Step 2. Read TABLE_B's offset table to create a lookup table for the start of each non-rival monster record
  const offsetBytes = await source.read(
    MF3_DAT + TABLE_B_OFFSET_TABLE,
    NON_RIVAL_MONSTER_COUNT * 4,
  );
  const lookup = new DataView(
    offsetBytes.buffer,
    offsetBytes.byteOffset,
    offsetBytes.byteLength,
  );

  // Step 3. Create a patch for each non-rival monster
  const patches: IsoPatch[] = [];
  for (let i = 0; i < NON_RIVAL_MONSTER_COUNT; i++) {
    // MR3 uses Little Endian unsigned 32-bit integers for offsets
    const relativeOffset = lookup.getUint32(i * 4, true);

    // Get the address of the record we want to update
    const recordAddress = MF3_DAT + TABLE_B_START + relativeOffset;

    // Read the monster's existing stats
    const life = await read_UInt16(source, recordAddress + TABLE_B_LIF_OFFSET);
    const power = await read_UInt16(source, recordAddress + TABLE_B_POW_OFFSET);
    const intelligence = await read_UInt16(
      source,
      recordAddress + TABLE_B_INT_OFFSET,
    );
    const speed = await read_UInt16(source, recordAddress + TABLE_B_SPD_OFFSET);
    const defense = await read_UInt16(
      source,
      recordAddress + TABLE_B_DEF_OFFSET,
    );
    logger?.(
      `Monster Address ${recordAddress.toString(16)}: Life=${life}, Power=${power}, Intelligence=${intelligence}, Speed=${speed}, Defense=${defense}`,
    );

    // Shuffle the Stats
    const stats = _.shuffle([life, power, intelligence, speed, defense]);

    // Jitter the Stats
    const jitterPercentage = 0.1;
    for (let j = 0; j < stats.length; j++) {
      const jitter = _.random(-jitterPercentage, jitterPercentage);
      const amount = stats[j] * jitter;
      const stat = stats[j] + amount;
      const clampedStat = _.clamp(Math.round(stat), 0, 999);
      stats[j] = clampedStat;
    }
    logger?.(
      `Monster ${names[i]} at ${recordAddress.toString(16)}: Shuffled and jittered stats: Life=${stats[0]}, Power=${stats[1]}, Intelligence=${stats[2]}, Speed=${stats[3]}, Defense=${stats[4]}`,
    );

    // Safety Check: Ensure Life can't be too low
    stats[0] = Math.max(stats[0], Math.round(life / 2), 10);

    // Encode the monster's stats
    const encodedStats = new Uint8Array(stats.length * 2);
    const view = new DataView(encodedStats.buffer);
    for (let j = 0; j < stats.length; j++) {
      view.setUint16(j * 2, stats[j], true);
    }

    // Create a patch for the monster's stats
    patches.push({
      offset: recordAddress + TABLE_B_LIF_OFFSET,
      data: encodedStats,
    });

    // Create a patch for the monster's name
    const encoded = encodeMr3Text(names[i], MONSTER_NAME_FIELD_LENGTH);
    patches.push({
      offset: recordAddress,
      data: encoded,
    });
  }

  // Step 4. Return the collection of non-rival monster patches
  logger?.("Finished randomizing non-rival monsters!");
  return patches;
}
