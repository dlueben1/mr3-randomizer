import namePool from "../data/other/mr3_name_pool.json";

// The length of a monster's name (which seems way bigger than the in-game UI supports BTW)
export const MONSTER_NAME_FIELD_LENGTH = 0x20;

/**
 * Creates a collection of X monster names.
 * In true Narmif A/Norris K fashion, many names will get a random letter assigned to them at the end!
 * @param count The number of monster names to generate
 */
export function getMonsterNames(count: number): string[] {
  // 25% chance to add a random letter at the end, Narmif A style!
  const suffixOdds = 0.25;

  // Defensive guard for tired-future-me
  if (!Number.isInteger(count) || count < 0 || count > namePool.length) {
    throw new RangeError(
      "count must be an integer between 0 and the name pool size",
    );
  }

  // Select K names from the name pool
  const pool = [...namePool];
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];

    let name = pool[i];

    // Append our Narmif-style letter
    if (Math.random() < suffixOdds) {
      name += ` ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    }
    names.push(name);
  }

  // And return the selected names!
  return names;
}
