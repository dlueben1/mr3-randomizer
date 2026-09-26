/**
 * Utility functions for reading data from the MR3 ISO, using Little Endian byte order.
 */

import { IsoSource } from "../types";

// #region Reading Memory

/**
 * Reads a sequence of bytes from the ISO source at the specified offset and length.
 * Base function for reading the different types of data from the ISO source.
 * @param source The ISO source to read from.
 * @param offset The offset within the ISO source to start reading from.
 * @param length The number of bytes to read.
 * @returns A DataView representing the bytes read from the ISO source.
 */
async function readBytes(
  source: IsoSource,
  offset: number,
  length: number,
): Promise<DataView<ArrayBufferLike>> {
  const bytes = await source.read(offset, length);
  const data = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return data;
}

/**
 * Reads a UInt16 value from the ISO source at the specified offset.
 * @param source The ISO source to read from.
 * @param offset The offset within the ISO source to read the UInt16 value from.
 * @returns The UInt16 value read from the specified offset.
 */
export async function read_UInt16(
  source: IsoSource,
  offset: number,
): Promise<number> {
  const data = await readBytes(source, offset, 2);
  const value = data.getUint16(0, true);
  return value;
}

/**
 * Reads a UInt8 value from the ISO source at the specified offset.
 * @param source The ISO source to read from.
 * @param offset The offset within the ISO source to read the UInt8 value from.
 * @returns The UInt8 value read from the specified offset.
 */
export async function read_UInt8(
  source: IsoSource,
  offset: number,
): Promise<number> {
  const data = await readBytes(source, offset, 1);
  const value = data.getUint8(0);
  return value;
}

// #endregion
