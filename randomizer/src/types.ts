/**
 * Represents a source ISO file that can be read from
 */
export interface IsoSource {
  readonly size: number;

  read(offset: number, length: number): Promise<Uint8Array>;
}

/**
 * Represents an output ISO file that can be written to
 */
export interface IsoOutput {
  write(offset: number, data: Uint8Array): Promise<void>;

  close(): Promise<void>;
}

/**
 * Represents a basic patch to the ISO
 */
export interface IsoPatch {
  offset: number;
  data: Uint8Array;
}
