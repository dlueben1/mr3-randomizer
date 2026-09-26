import _ from "lodash";
import raceMoveMapJson from "../data/monsters/race_move_map.json";

// #region Moveset

/**
 * Lookup table for what moves are available to each monster breed.
 */
const raceMoveMap: Record<number, MonsterMove[]> = raceMoveMapJson as Record<
  number,
  MonsterMove[]
>;

/** A rough estimate of the sum total of stats a weak monster has */
const MIN_STAT_TOTAL = 500;

/** A rough estimate of the sum total of stats a strong monster has */
const MAX_STAT_TOTAL = 2700;

/** The maximum allowed variation in tech level for a monster's moves */
const TECH_LEVEL_VARIATION = 0.125;

/**
 * Selects a Tech Level for a given move, based on the monster's stat total and the move's maximum tech level.
 * This allows us to guesstimate an appropriate tech level for the move based on the monster's overall strength.
 * @param statTotal The total stats of the monster.
 * @param maxTechLevel The maximum tech level the move can have.
 * @returns The selected tech level for the move.
 */
export function randomTechLevel(
  statTotal: number,
  maxTechLevel: number,
): number {
  // Sanity check for the maximum tech level
  const maxLevel = Math.max(0, Math.floor(maxTechLevel));
  if (maxLevel === 0) return 0;

  const statProgress = _.clamp(
    (statTotal - MIN_STAT_TOTAL) / (MAX_STAT_TOTAL - MIN_STAT_TOTAL),
    0,
    1,
  );

  // Triangular random variation, centered on the stat-based progression.
  const variation =
    (_.random(0, 1, true) + _.random(0, 1, true) - 1) * TECH_LEVEL_VARIATION;

  const moveProgress = _.clamp(statProgress + variation, 0, 1);

  return Math.round(moveProgress * maxLevel);
}

/**
 * Generates a moveset for a given monster breed based on the specified count and stat total.
 * @param breed The ID of the monster breed for which to generate the moveset.
 * @param count The number of moves to include in the moveset.
 * @param intStat The monster's intelligence stat.
 * @param powStat The monster's power stat.
 */
export function generateMoveset(
  breed: number,
  count: number,
  intStat: number,
  powStat: number,
): MonsterMove[] {
  // Safety Check
  if (!raceMoveMap[breed]) {
    throw new Error(`No moves available for breed ${breed}`);
  }

  // Sanitize the count to a valid range
  count = Math.max(1, Math.min(count, 4));

  // Separate moves by damage type
  const availableMoves = raceMoveMap[breed];
  const intMoves = availableMoves.filter((move) => move.type === "Intellect");
  const powMoves = availableMoves.filter((move) => move.type === "Power");

  // Determine if the monster is more intelligence-focused or power-focused, or if they're an "all-rounder"
  const allRounderThreshold = 0.2;
  const dominance = (intStat - powStat) / (intStat + powStat);
  let focus: "Intellect" | "Power" | "All-Rounder";
  let priorityPool: MonsterMove[];
  let secondaryPool: MonsterMove[];
  if (dominance > allRounderThreshold) {
    focus = "Intellect";
    priorityPool = intMoves;
    secondaryPool = powMoves;
  } else if (dominance < -allRounderThreshold) {
    focus = "Power";
    priorityPool = powMoves;
    secondaryPool = intMoves;
  } else {
    focus = "All-Rounder";
    priorityPool = availableMoves;
    secondaryPool = [];
  }

  // Prepare the moveset
  const selectedMoves: MonsterMove[] = [];

  // First, we need a bit move always
  const bitMove =
    _.sample(priorityPool.filter((move) => move.category === "Bit")) ??
    _.sample(secondaryPool.filter((move) => move.category === "Bit"));
  selectedMoves.push(bitMove!);

  // Fill the rest of the moveset
  const movesNeeded = count - selectedMoves.length;

  // All-Rounders get a mix of any available moves...
  if (focus === "All-Rounder") {
    const remainingMoves = availableMoves.filter(
      (move) => !selectedMoves.includes(move),
    );
    selectedMoves.push(..._.sampleSize(remainingMoves, movesNeeded));
  }
  // ...while focused monsters prioritize their main type
  else {
    for (let i = 0; i < movesNeeded; i++) {
      const priorityAvailable = priorityPool.filter(
        (move) => !selectedMoves.includes(move),
      );
      const secondaryAvailable = secondaryPool.filter(
        (move) => !selectedMoves.includes(move),
      );

      if (priorityAvailable.length === 0 && secondaryAvailable.length === 0) {
        break;
      }

      // 3/4 odds for preferred move damage type, 1/4 for non-preferred
      const preferPriority = _.random(0, 3) !== 0;
      const preferredPool = preferPriority
        ? priorityAvailable
        : secondaryAvailable;
      const fallbackPool = preferPriority
        ? secondaryAvailable
        : priorityAvailable;

      const move = _.sample(
        preferredPool.length > 0 ? preferredPool : fallbackPool,
      );

      if (move) selectedMoves.push(move);
    }
  }

  // Return the selected moveset
  return selectedMoves;
}

// #endregion
