from rule_builder.rules import Has, HasAny, HasFromListUnique, CanReachRegion, AtLeast
from .items import all_items

MORX_DRILLS = [name for name in all_items if name.startswith("Morx Drill")]
ALL_DRILLS = [name for name in all_items if "Drill" in name]
TECH_BITS = [name for name in all_items if name.endswith("Bit")]
TECH_STONES = [name for name in all_items if name.endswith("Stone")]
RAN_RAN_ITEMS = [name for name in all_items if name.startswith("Ran Ran")]
EARLY_RAN_RAN = ["Ran Ran Leaves", "Ran Ran Fruit"]
PERMITS = [name for name in all_items if name.endswith("Permit")]

# Checks how many Drills a player has access to
def has_accessible_drills(count: int):
    drill_rules = []

    for drill in ALL_DRILLS:
        # "Brillia Drill - Cross Seal" -> "Brillia"
        region_name = drill.split(" Drill - ", 1)[0]

        drill_rules.append(
            Has(drill) & CanReachRegion(region_name)
        )

    return AtLeast(count, *drill_rules)

# Create rules for soft logic of progressing through ranks
def set_rank_rules(world) -> None:
    # E -> D: Require at least one Morx Drill
    world.set_rule(
        world.get_location("Cleared Rank E Tochikan"),
        HasAny(*MORX_DRILLS),
    )

    # D -> C: Require at least two Morx Drills and a Bit or an early game Ran Ran Item 
    world.set_rule(
        world.get_location("Cleared Rank D Tochikan"),
        HasFromListUnique(*MORX_DRILLS, count=2) & (HasAny(*TECH_BITS) | HasAny(*EARLY_RAN_RAN)),
    )

    # C -> B: Require a Ran Ran Item AND either two bits or a stone 
    world.set_rule(
        world.get_location("Cleared Rank C Tochikan"),
        HasAny(*RAN_RAN_ITEMS) & (HasFromListUnique(*TECH_BITS, count=2) | HasAny(*TECH_STONES)),
    )

    # B -> A: Require at least two Ran Ran items, one Permit and 4 Accessible Drills
    world.set_rule(
        world.get_location("Cleared Rank B Tochikan"),
        HasFromListUnique(*RAN_RAN_ITEMS, count=2) & HasAny(*PERMITS) & has_accessible_drills(4),
    )

    # A -> S: Require 2 permits and 6 Accessible Drills
    world.set_rule(
        world.get_location("Cleared Rank A Tochikan"),
        HasFromListUnique(*PERMITS, count=2) & has_accessible_drills(6),
    )

    # S -> Big 5: Require 3 permits, 2 stones, and 10 Accessible Drills
    world.set_rule(
        world.get_location("Cleared Rank S Tochikan"),
        HasFromListUnique(*PERMITS, count=3) & HasFromListUnique(*TECH_STONES, count=2) & has_accessible_drills(10),
    )