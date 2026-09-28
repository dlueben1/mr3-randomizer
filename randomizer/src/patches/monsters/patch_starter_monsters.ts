/**
 * Patches the three monsters you get to start the game with
 */

import { IsoPatch, IsoSource } from "../../types";
import { BREED_COUNT } from "../../data/consts";
import raceHaseiMapJson from "../../data/monsters/race_hasei_map.json";
import _ from "lodash";
import { ENCYCLOPEDIA_STARTER_MON_OFFSET } from "../../addresses/SLUS_20190";

/**
 * Lookup table of valid values for `hasei` (variant) for each breed of monster
 */
const RACE_HASEI_MAP: Record<number, number[]> = raceHaseiMapJson;

export async function randomizeStarterMonsters(
  logger?: (message: string) => void,
): Promise<IsoPatch[]> {
  // Select three distinct values between 0 and BREED_COUNT - 1 for the starter monsters
  const breeds = Array.from({ length: BREED_COUNT }, (_, index) => index);
  const starterBreeds = _.sampleSize(breeds, 3);

  // Prepare a patch for each starter monster
  const patches: IsoPatch[] = [];
  for (let i = 0; i < starterBreeds.length; i++) {
    // Determine the breed and hasei (variant) for this starter monster
    const breed = starterBreeds[i];
    const hasei = _.sample(RACE_HASEI_MAP[breed] ?? [0]);
    logger?.(`Starter monster ${i + 1}: Breed=${breed}, Hasei=${hasei ?? 0}`);

    // Create a patch for this starter monster
    patches.push({
      offset: ENCYCLOPEDIA_STARTER_MON_OFFSET + i * 2, // Replace with the correct offset for the starter monster
      data: new Uint8Array([breed, hasei ?? 0]),
    });
  }

  // Add a terminator patch for starter monsters
  patches.push({
    offset: ENCYCLOPEDIA_STARTER_MON_OFFSET + starterBreeds.length * 2,
    data: new Uint8Array([0xff, 0xff]),
  });

  return patches;
}
