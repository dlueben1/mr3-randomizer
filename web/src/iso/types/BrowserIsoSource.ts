import type { IsoSource } from "@mr3/randomizer";

export class BrowserIsoSource implements IsoSource {
  private readonly file: File;

  constructor(file: File) {
    this.file = file;
  }

  get size(): number {
    return this.file.size;
  }

  async read(offset: number, length: number): Promise<Uint8Array> {
    const buffer = await this.file.slice(offset, offset + length).arrayBuffer();

    return new Uint8Array(buffer);
  }
}
