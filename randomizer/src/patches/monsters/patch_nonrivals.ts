/**
 * Patches non-rival monsters in the game, so they can be fully randomized.
 * Non-rival monsters live in TABLE_B of MR3.dat
 */

import { IsoSource } from "../..";
import { read_UInt16, read_UInt8 } from "../../utils/isoUtility";
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
  TABLE_B_MOVES_OFFSET,
} from "../../addresses/MF3_DAT";
import { encodeMr3Text } from "../../utils/textUtility";
import { IsoPatch } from "../../types";
import _ from "lodash";
import { BREED_COUNT } from "../../data/consts";
import raceHaseiMapJson from "../../data/monsters/race_hasei_map.json";
import { generateMoveset, randomTechLevel } from "../../utils/monsterUtility";

/**
 * The number of non-rival monsters in the game.
 */
const NON_RIVAL_MONSTER_COUNT = 125;

/**
 * Lookup table of valid values for `hasei` (variant) for each breed of monster
 */
const RACE_HASEI_MAP: Record<number, number[]> = raceHaseiMapJson;

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

  // Step 3. Randomize each non-rival monster
  const patches: IsoPatch[] = [];
  for (let i = 0; i < NON_RIVAL_MONSTER_COUNT; i++) {
    // MR3 uses Little Endian unsigned 32-bit integers for offsets
    const relativeOffset = lookup.getUint32(i * 4, true);

    // Get the address of the record we want to update
    const recordAddress = MF3_DAT + TABLE_B_START + relativeOffset;

    /** Randomize Stats */

    // Read the monster's existing stats
    let life = await read_UInt16(source, recordAddress + TABLE_B_LIF_OFFSET);
    let power = await read_UInt16(source, recordAddress + TABLE_B_POW_OFFSET);
    let intelligence = await read_UInt16(
      source,
      recordAddress + TABLE_B_INT_OFFSET,
    );
    let speed = await read_UInt16(source, recordAddress + TABLE_B_SPD_OFFSET);
    let defense = await read_UInt16(source, recordAddress + TABLE_B_DEF_OFFSET);
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

    // Update the stats for the rest of the generator
    life = stats[0];
    power = stats[1];
    intelligence = stats[2];
    speed = stats[3];
    defense = stats[4];

    // Encode the monster's stats
    const encodedStats = new Uint8Array(stats.length * 2);
    let view = new DataView(encodedStats.buffer);
    for (let j = 0; j < stats.length; j++) {
      view.setUint16(j * 2, stats[j], true);
    }

    // Create a patch for the monster's stats
    patches.push({
      offset: recordAddress + TABLE_B_LIF_OFFSET,
      data: encodedStats,
    });

    /** Randomize Name, Breed / Hasei (Variant) */

    // Randomize the monster's breed and hasei (sub-breed)
    const breed = _.random(0, BREED_COUNT - 1);
    const hasei = _.sample(RACE_HASEI_MAP[breed] ?? [0]);
    logger?.(
      `Monster ${names[i]} at ${recordAddress.toString(16)}: Breed=${breed}, Hasei=${hasei ?? 0}`,
    );

    // Create a patch for the monster's name, breed and hasei
    const encodedName = encodeMr3Text(names[i], MONSTER_NAME_FIELD_LENGTH);
    const encodedRaceHasei = new Uint8Array(2);
    view = new DataView(encodedRaceHasei.buffer);
    view.setUint8(0, breed);
    view.setUint8(1, hasei ?? 0);
    patches.push({
      offset: recordAddress,
      data: new Uint8Array([...encodedName, ...encodedRaceHasei]),
    });

    /** Randomize Moveset */

    // Read the number of moves for this monster
    const movesOffset = recordAddress + TABLE_B_MOVES_OFFSET;
    let moveCount = 0;
    for (let j = 0; j < 8; j += 2) {
      const moveId = await read_UInt8(source, movesOffset + j);
      if (moveId !== 0xff) moveCount++;
    }

    // Determine if we should give them one more than they normally have (overflow is handled by the util function)
    const giveExtraMove = _.random(0, 1) === 1;
    if (giveExtraMove) moveCount++;

    // Generate the moves for this monster
    const moves: MonsterMove[] = generateMoveset(
      breed,
      moveCount,
      intelligence,
      power,
    );

    // Generate tech levels for each move
    const techLevels = moves.map((move) =>
      randomTechLevel(
        intelligence + power + speed + defense + life,
        move.maxTechLevel,
      ),
    );

    // Create a patch for this monster's moveset and tech levels
    const encodedMoves = new Uint8Array(8);
    view = new DataView(encodedMoves.buffer);
    for (let m = 0; m < 4; m++) {
      const start = m * 2;
      view.setUint8(start, moves[m]?.moveA ?? 0xff);
      view.setUint8(start + 1, techLevels[m] ?? 0);
    }
    patches.push({
      offset: recordAddress + TABLE_B_MOVES_OFFSET,
      data: encodedMoves,
    });
  }

  // Step 4. Return the collection of non-rival monster patches
  logger?.("Finished randomizing non-rival monsters!");
  return patches;
}
