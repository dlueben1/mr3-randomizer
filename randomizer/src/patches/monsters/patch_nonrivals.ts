/**
 * Patches non-rival monsters in the game, so they can be fully randomized.
 * Non-rival monsters live in TABLE_B of MR3.dat
 */

import { IsoSource } from "../..";
import { MONSTER_NAME_FIELD_LENGTH } from "../../utils/nameUtility";
import { getMonsterNames } from "../../utils/nameUtility";
import {
  MR3_DAT,
  TABLE_B_START,
  TABLE_B_OFFSET_TABLE,
} from "../../addresses/MR3_DAT";
import { encodeMr3Text } from "../../utils/textUtility";
import { IsoPatch } from "../../types";

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
): Promise<IsoPatch[]> {
  // Step 1. Select a random list of monster names
  const names = getMonsterNames(NON_RIVAL_MONSTER_COUNT);

  // Step 2. Read TABLE_B's offset table to create a lookup table for the start of each non-rival monster record
  const offsetBytes = await source.read(
    MR3_DAT + TABLE_B_OFFSET_TABLE,
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
    const recordAddress = MR3_DAT + TABLE_B_START + relativeOffset;

    // Create a patch for the monster's name
    const encoded = encodeMr3Text(names[i], MONSTER_NAME_FIELD_LENGTH);
    patches.push({
      offset: recordAddress,
      data: encoded,
    });
  }

  // Step 4. Return the collection of non-rival monster patches
  return patches;
}
