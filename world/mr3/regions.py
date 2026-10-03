from BaseClasses import Region
from world.mr3 import world


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

    # Connect unlockables to Morx (I know in the Vanilla game they're pseudo-progressive but for now I want to try them independently)
    morx.connect(brillia, "Unlock Brillia", lambda state: state.has("Brillia Permit", world.player))
    morx.connect(takrama, "Unlock Takrama", lambda state: state.has("Takrama Permit", world.player))
    morx.connect(goat, "Unlock Goat", lambda state: state.has("Goat Permit", world.player))
    morx.connect(kalaragi, "Unlock Kalaragi", lambda state: state.has("Kalaragi Permit", world.player))

    # Connect the ranks in order
    morx.connect(rank_e, "Starting Rank")
    rank_e.connect(rank_d, "Unlock Rank D", lambda state: state.has("Cleared Rank E Tochikan", world.player))
    rank_d.connect(rank_c, "Unlock Rank C", lambda state: state.has("Cleared Rank D Tochikan", world.player))
    rank_c.connect(rank_b, "Unlock Rank B", lambda state: state.has("Cleared Rank C Tochikan", world.player))
    rank_b.connect(rank_a, "Unlock Rank A", lambda state: state.has("Cleared Rank B Tochikan", world.player))
    rank_a.connect(rank_s, "Unlock Rank S", lambda state: state.has("Cleared Rank A Tochikan", world.player))
    rank_s.connect(big_5, "Unlock Big 5", lambda state: state.has("Cleared Rank S Tochikan", world.player))

    # Register the regions with the multiworld
    world.multiworld.regions += [morx, brillia, takrama, goat, kalaragi, rank_e, rank_d, rank_c, rank_b, rank_a, rank_s, big_5]