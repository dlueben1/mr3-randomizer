/**
 * Where MF3.DAT lives in the ISO - this is where most of the game's content is
 */
export const MF3_DAT = 0x0011f800;

// #region Table B (Non-Rival Opponents)

/**
 * The section of MF3.DAT where non-rival monsters are stored
 */
export const TABLE_B_START = 0x008aa000;

export const TABLE_B_LIF_OFFSET = 0x24;
export const TABLE_B_POW_OFFSET = 0x26;
export const TABLE_B_INT_OFFSET = 0x28;
export const TABLE_B_SPD_OFFSET = 0x2a;
export const TABLE_B_DEF_OFFSET = 0x2c;

/**
 * The offset/lookup table for non-rival monsters in TABLE_B of MF3.DAT
 */
export const TABLE_B_OFFSET_TABLE = 0x008aa0f0;

// #endregion
