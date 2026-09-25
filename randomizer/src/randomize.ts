import { randomizeNonRivalMonsters } from "./patches/monsters/patch_nonrivals";
import type { IsoOutput, IsoSource } from "./types";
import { getMonsterNames } from "./utils/nameUtility";

const CHUNK_SIZE = 8 * 1024 * 1024;

/**
 * Randomizes the content of an MR3 ISO!
 */
export async function randomizeIso(
  source: IsoSource,
  output: IsoOutput,
  onProgress?: (progress: number) => void,
  logger?: (message: string) => void,
): Promise<void> {
  logger?.("Starting randomization of ISO");

  // Progress Updates are split into thirds: patch creation, ISO copy, patch application
  const PHASE_SIZE = 1 / 3;

  // Set initial progress
  onProgress?.(0);

  // Phase #1: Create Patches to apply
  const nonRivalMonsterPatches = await randomizeNonRivalMonsters(
    source,
    logger,
  );

  // Merge all patches into a single array
  const allPatches = [...nonRivalMonsterPatches];
  onProgress?.(PHASE_SIZE);

  // Phase #2: Copy the ISO content to the output ISO (yes I know this could be done in two passes but I'm intimidated)
  for (let offset = 0; offset < source.size; offset += CHUNK_SIZE) {
    const length = Math.min(CHUNK_SIZE, source.size - offset);

    const bytes = await source.read(offset, length);

    await output.write(offset, bytes);

    // Update progress after each chunk is copied
    onProgress?.(
      PHASE_SIZE + Math.min((offset + length) / source.size, 1) * PHASE_SIZE,
    );
  }

  // Phase #3: Apply Patches to the ISO (66% - 100%)
  for (let i = 0; i < allPatches.length; i++) {
    const patch = allPatches[i];
    await output.write(patch.offset, patch.data);

    // Update progress after each patch is applied
    onProgress?.(2 * PHASE_SIZE + ((i + 1) / allPatches.length) * PHASE_SIZE);
  }

  // Save & Finish!
  await output.close();
  logger?.("Finished randomization of ISO!");
  onProgress?.(1);
}
