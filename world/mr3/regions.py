from BaseClasses import Region
from world.mr3 import world
from .locations import MR3Location, location_groups, all_locations


def create_regions(world) -> None:
    # The Five Training Areas
    morx = Region("Morx", world.player, world.multiworld)
    brillia = Region("Brillia", world.player, world.multiworld)
    takrama = Region("Takrama", world.player, world.multiworld)
    goat = Region("Goat", world.player, world.multiworld)
    kalaragi = Region("Kalaragi", world.player, world.multiworld)

    # The Six Ranks + Big 5 Track
    rank_e = Region("Rank E", world.player, world.multiworld)
    rank_d = Region("Rank D", world.player, world.multiworld)
    rank_c = Region("Rank C", world.player, world.multiworld)
    rank_b = Region("Rank B", world.player, world.multiworld)
    rank_a = Region("Rank A", world.player, world.multiworld)
    rank_s = Region("Rank S", world.player, world.multiworld)
    big_5 = Region("Big 5", world.player, world.multiworld)
    rank_regions = {
        "E": rank_e,
        "D": rank_d,
        "C": rank_c,
        "B": rank_b,
        "A": rank_a,
        "S": rank_s,
    }

    # Connect unlockables to Morx (I know in the Vanilla game they're pseudo-progressive but for now I want to try them independently)
    morx.connect(brillia, "Unlock Brillia", lambda state: state.has("Brillia Permit", world.player))
    morx.connect(takrama, "Unlock Takrama", lambda state: state.has("Takrama Permit", world.player))
    morx.connect(goat, "Unlock Goat", lambda state: state.has("Goat Permit", world.player))
    morx.connect(kalaragi, "Unlock Kalaragi", lambda state: state.has("Kalaragi Permit", world.player))

    # Connect the ranks in order
    morx.connect(rank_regions["E"], "Starting Rank")
    for current_rank, next_rank in zip("EDCBA", "DCBAS"):
        rank_regions[current_rank].connect(
            rank_regions[next_rank],
            f"Unlock Rank {next_rank}",
            lambda state, rank=current_rank: state.has(
                f"Cleared Rank {rank} Tochikan", world.player
            ),
        )
    rank_s.connect(big_5, "Unlock Big 5", lambda state: state.has("Cleared Rank S Tochikan", world.player))

    # Map the Rank locations to their respective regions
    for rank, region in rank_regions.items():
        # Rank S doesn't have the Big 5 until you beat the Tochikan Festa, so this should be skipped in this loop
        if rank == "S":
            continue
        tournament_names = location_groups.get(f"Rank {rank} Tournaments", ())
        location_names = (*tournament_names, f"Tochikan Festa - Rank {rank}")
        region.add_locations(
            {name: all_locations[name] for name in location_names},
            MR3Location,
        )
    rank_s.add_locations(
        {
            "Tochikan Festa - Rank S": all_locations["Tochikan Festa - Rank S"]
        },
        MR3Location
    )
    big_5.add_locations(
        {
            name: all_locations[name] for name in location_groups["Big 5 Tournaments"]
        },
        MR3Location
    )

    # Map the regional locations to their respective regions
    morx.add_locations(
        {
            name: all_locations[name] for name in all_locations if name.startswith("Morx Ran Ran")
        },
        MR3Location
    )
    brillia.add_locations(
        {
            name: all_locations[name] for name in all_locations if name.startswith("Brillia Ran Ran")
        },
        MR3Location
    )
    takrama.add_locations(
        {
            name: all_locations[name] for name in all_locations if name.startswith("Takrama Ran Ran")
        },
        MR3Location
    )
    goat.add_locations(
        {
            name: all_locations[name] for name in all_locations if name.startswith("Goat Ran Ran")
        },
        MR3Location
    )
    kalaragi.add_locations(
        {
            name: all_locations[name] for name in all_locations if name.startswith("Kalaragi Ran Ran")
        },
        MR3Location
    )

    # Add the Fake Event Location/Item pairs
    for rank, region in rank_regions.items():
        event_name = f"Cleared Rank {rank} Tochikan"
        event_location = MR3Location(world.player, event_name, None, region)
        event_location.place_locked_item(world.create_event(event_name))
        region.locations.append(event_location)

    # Register the regions with the multiworld
    world.multiworld.regions += [morx, brillia, takrama, goat, kalaragi, rank_e, rank_d, rank_c, rank_b, rank_a, rank_s, big_5]