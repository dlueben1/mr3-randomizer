import { randomizeIso } from "@mr3/randomizer";
import { BrowserIsoSource } from "./types/BrowserIsoSource";
import { OpfsIsoOutput } from "./types/OpfsIsoOutput";

export interface RandomizationResult {
  file: File;

  /*
   * Deletes the randomized ISO from OPFS.
   *
   * The caller decides when it is safe to run this
   * (e.g. when the user leaves the page), so the download
   * is never pulled out from under them.
   */
  cleanup: () => Promise<void>;
}

export async function randomize(
  iso: File,
  onProgress?: (progress: number) => void,
): Promise<RandomizationResult> {
  const source = new BrowserIsoSource(iso);

  const output = await OpfsIsoOutput.create("MR3-Randomized.iso");

  try {
    await randomizeIso(source, output, onProgress, console.log);
  } catch (error) {
    /*
     * Never leave a partially randomized ISO behind.
     */
    await output.remove();

    throw error;
  }

  return {
    file: await output.getFile(),
    cleanup: () => output.remove(),
  };
}
