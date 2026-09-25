import type { IsoOutput } from "@mr3/randomizer";

export class OpfsIsoOutput implements IsoOutput {
  private writable?: FileSystemWritableFileStream;

  private readonly root: FileSystemDirectoryHandle;
  private readonly filename: string;
  private readonly handle: FileSystemFileHandle;

  private constructor(
    root: FileSystemDirectoryHandle,
    filename: string,
    handle: FileSystemFileHandle,
  ) {
    this.root = root;
    this.filename = filename;
    this.handle = handle;
  }

  static async create(filename: string): Promise<OpfsIsoOutput> {
    const root = await navigator.storage.getDirectory();

    const handle = await root.getFileHandle(filename, {
      create: true,
    });

    const output = new OpfsIsoOutput(root, filename, handle);

    output.writable = await handle.createWritable();

    return output;
  }

  async write(offset: number, data: Uint8Array): Promise<void> {
    if (!this.writable) {
      throw new Error("Output is not open.");
    }

    await this.writable.seek(offset);

    /*
     * Guarantee an ArrayBuffer-backed Uint8Array.
     *
     * The IsoOutput interface accepts a generic Uint8Array,
     * whose backing buffer could theoretically be SharedArrayBuffer.
     */
    const writableData = new Uint8Array(data.byteLength);
    writableData.set(data);

    await this.writable.write(writableData);
  }

  async close(): Promise<void> {
    const writable = this.writable;
    this.writable = undefined;

    await writable?.close();
  }

  /*
   * Discards any unflushed data without throwing.
   */
  async abort(): Promise<void> {
    const writable = this.writable;
    this.writable = undefined;

    try {
      await writable?.abort();
    } catch {
      /*
       * Nothing useful to recover here.
       * The entry is deleted afterwards anyway.
       */
    }
  }

  /*
   * Deletes the OPFS entry, aborting the writable first if needed.
   */
  async remove(): Promise<void> {
    await this.abort();

    try {
      await this.root.removeEntry(this.filename);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "NotFoundError")) {
        throw error;
      }
    }
  }

  async getFile(): Promise<File> {
    return this.handle.getFile();
  }
}
