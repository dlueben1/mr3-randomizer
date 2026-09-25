const MR3_SPACE = 0x55;
const MR3_TERMINATOR = 0xff;

/**
 * Converts a string into the MR3 text encoding format
 * @param text The string to encode
 * @param fieldLength The length of the MR3 text field
 * @returns A Uint8Array containing the encoded text
 */
export function encodeMr3Text(text: string, fieldLength: number): Uint8Array {
  // Prepare the new string as a fixed-length MR3 text field
  const result = new Uint8Array(fieldLength);

  // Fill the whole field with terminators before we fill in real characters
  result.fill(MR3_TERMINATOR);

  // Defensive guard to ensure we don't overflow the MR3 text field
  if (text.length >= fieldLength) {
    throw new Error(
      `Text "${text}" is too long for a ${fieldLength}-byte MR3 field.`,
    );
  }

  // Encode one character at a time
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);

    // A-Z -> 0x00-0x19
    if (char >= 65 && char <= 90) {
      result[i] = char - 65;
      continue;
    }

    // a-z -> 0x1A-0x33
    if (char >= 97 && char <= 122) {
      result[i] = 0x1a + (char - 97);
      continue;
    }

    // Spaces
    if (char === 32) {
      result[i] = MR3_SPACE;
      continue;
    }

    // If we reach this point, the character is not supported (more likely, I don't know the encoding for it yet)
    throw new Error(
      `Character "${text[i]}" cannot currently be encoded as MR3 text.`,
    );
  }

  // Return the fully encoded MR3 text field
  return result;
}
