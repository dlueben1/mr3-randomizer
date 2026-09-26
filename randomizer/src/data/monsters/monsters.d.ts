/**
 * Represents a Monster's Move
 * Currently only contains what's necessary for non-rival monsters, needs expanding one day
 */
interface MonsterMove {
  /** Move ID, indexed per species. */
  moveA: number;

  /** Display name of the move. */
  name: string;

  /** Highest tech level at which the move can be learned. */
  maxTechLevel: number;

  /** Raw category value from the game data. */
  categoryCode: string;

  /** Move category, such as Bit, Stone, or Orb. */
  category: "Bit" | "Stone" | "Orb";

  /** Move's elemental affinity. */
  element: "Aqua" | "Aurora" | "Jade" | "Flare";

  /** Numeric flag indicating the move's type. */
  typeFlag: number;

  /** Interpreted move type, such as Power or Intellect. */
  type: "Power" | "Intellect";
}
