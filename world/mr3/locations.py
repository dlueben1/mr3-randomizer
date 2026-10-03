from BaseClasses import Location, LocationProgressType

# Instance Data for MR3 Locations
class MR3Location(Location):
    game = "Monster Rancher 3"

# All Locations on the "Rank" progression axis
rank_locations = {
    # Tochikan Festas (Rank Progression)
    "Tochikan Festa - Rank E": 1,
    "Tochikan Festa - Rank D": 2,
    "Tochikan Festa - Rank C": 3,
    "Tochikan Festa - Rank B": 4,
    "Tochikan Festa - Rank A": 5,
    "Tochikan Festa - Rank S": 6,

    # Rank E Tournaments
    "Fresh Leaf Cup": 10,         # Morx E
    "Oasis Cup": 11,              # Takrama E
    "Green Tournament": 12,       # Kalaragi E
    "Snow Rookie Battle": 13,     # Brillia E
    "Ripples Tyro Match": 14,     # Goat E

    # Rank D Tournaments
    "Mushroom Cup": 20,           # Morx D
    "PokePoke Bros Memorial": 21, # Takrama D
    "Prickly Water Lily Cup": 22, # Kalaragi D
    "Yukiran Memorial": 23,       # Brillia D
    "Seagull Tournament": 24,     # Goat D

    # Rank C Tournaments
    "Asunaro Tournament": 30,     # Morx C
    "Mirage Cup": 31,             # Takrama C
    "Squall Cup": 32,             # Kalaragi C
    "Crystal Flower Cup": 33,     # Brillia C
    "Red Coral Cup": 34,          # Goat C

    # Rank B Tournaments
    "Harvest Festa Memorial": 40, # Morx B
    "Hot Hot Tournament": 41,     # Takrama B
    "Umbagi Fall Festa": 42,      # Kalaragi B
    "Aurora Tournament": 43,      # Brillia B
    "Wild Waves Cup": 44,         # Goat B

    # Rank A Tournaments
    "Great Baum Carnivale": 50,   # Morx A
    "Sandstorm Cup": 51,          # Takrama A
    "Tropical Rumble": 52,        # Kalaragi A
    "Blizzard Cup": 53,           # Brillia A
    "Maelstrom Cup": 54,          # Goat A

    # Rank S Tournaments
    "Morx All Stars": 60,         # Morx S
    "Takrama Heat Challenge": 61, # Takrama S
    "Kalaragi Carnival": 62,      # Kalaragi S
    "Brillia Grand Prix": 63,     # Brillia S
    "Goat Big Tournament": 64,    # Goat S
}

# All Locations limited to a specific region
regional_locations = {
    # All Ran Ran locations to search
    "Morx Ran Ran - Visit Lord": 100,
    "Morx Ran Ran - Noisy Hall 1": 101,
    "Morx Ran Ran - Noisy Hall 2": 102,
    "Morx Ran Ran - Noisy Hall 3": 103,
    "Morx Ran Ran - Bad Feeling Spot 1": 104,
    "Morx Ran Ran - Bad Feeling Spot 2": 105,
    "Morx Ran Ran - Bad Feeling Spot 3": 106,
    "Morx Ran Ran - Discover Light Learn": 107,
    "Morx Ran Ran - Discover Tunnel": 108,
    "Morx Ran Ran - Discover Hit Moles": 109,
    "Morx Ran Ran - Generic Spot 1": 110,
    "Morx Ran Ran - Generic Spot 2": 111,
    "Morx Ran Ran - Generic Spot 3": 112,
    "Morx Ran Ran - Generic Spot 4": 113,
    "Morx Ran Ran - Generic Spot 5": 114,
    "Morx Ran Ran - Generic Spot 6": 115,
    "Morx Ran Ran - Generic Spot 7": 116,
    "Morx Ran Ran - Generic Spot 8": 117,
    "Morx Ran Ran - Generic Spot 9": 118,
    "Morx Ran Ran - Generic Spot 10": 119,
    "Takrama Ran Ran - Visit Lord": 120,
    "Takrama Ran Ran - Noisy Hall 1": 121,
    "Takrama Ran Ran - Noisy Hall 2": 122,
    "Takrama Ran Ran - Noisy Hall 3": 123,
    "Takrama Ran Ran - Bad Feeling Spot 1": 124,
    "Takrama Ran Ran - Bad Feeling Spot 2": 125,
    "Takrama Ran Ran - Bad Feeling Spot 3": 126,
    "Takrama Ran Ran - Discover Tornado": 127,
    "Takrama Ran Ran - Discover Real Thing": 128,
    "Takrama Ran Ran - Discover Daruma Rock": 129,
    "Takrama Ran Ran - Generic Spot 1": 130,
    "Takrama Ran Ran - Generic Spot 2": 131,
    "Takrama Ran Ran - Generic Spot 3": 132,
    "Takrama Ran Ran - Generic Spot 4": 133,
    "Takrama Ran Ran - Generic Spot 5": 134,
    "Takrama Ran Ran - Generic Spot 6": 135,
    "Takrama Ran Ran - Generic Spot 7": 136,
    "Takrama Ran Ran - Generic Spot 8": 137,
    "Takrama Ran Ran - Generic Spot 9": 138,
    "Takrama Ran Ran - Generic Spot 10": 139,
    "Kalaragi Ran Ran - Visit Lord": 140,
    "Kalaragi Ran Ran - Noisy Hall 1": 141,
    "Kalaragi Ran Ran - Noisy Hall 2": 142,
    "Kalaragi Ran Ran - Noisy Hall 3": 143,
    "Kalaragi Ran Ran - Bad Feeling Spot 1": 144,
    "Kalaragi Ran Ran - Bad Feeling Spot 2": 145,
    "Kalaragi Ran Ran - Bad Feeling Spot 3": 146,
    "Kalaragi Ran Ran - Discover Life Risk": 147,
    "Kalaragi Ran Ran - Discover Chase": 148,
    "Kalaragi Ran Ran - Discover Fishing": 149,
    "Kalaragi Ran Ran - Generic Spot 1": 150,
    "Kalaragi Ran Ran - Generic Spot 2": 151,
    "Kalaragi Ran Ran - Generic Spot 3": 152,
    "Kalaragi Ran Ran - Generic Spot 4": 153,
    "Kalaragi Ran Ran - Generic Spot 5": 154,
    "Kalaragi Ran Ran - Generic Spot 6": 155,
    "Kalaragi Ran Ran - Generic Spot 7": 156,
    "Kalaragi Ran Ran - Generic Spot 8": 157,
    "Kalaragi Ran Ran - Generic Spot 9": 158,
    "Kalaragi Ran Ran - Generic Spot 10": 159,
    "Brillia Ran Ran - Visit Lord": 160,
    "Brillia Ran Ran - Noisy Hall 1": 161,
    "Brillia Ran Ran - Noisy Hall 2": 162,
    "Brillia Ran Ran - Noisy Hall 3": 163,
    "Brillia Ran Ran - Bad Feeling Spot 1": 164,
    "Brillia Ran Ran - Bad Feeling Spot 2": 165,
    "Brillia Ran Ran - Bad Feeling Spot 3": 166,
    "Brillia Ran Ran - Discover Cross Seal": 167,
    "Brillia Ran Ran - Discover Dodge Seal": 168,
    "Brillia Ran Ran - Discover Dig Seal": 169,
    "Goat Ran Ran - Visit Lord": 170,
    "Goat Ran Ran - Noisy Hall 1": 171,
    "Goat Ran Ran - Noisy Hall 2": 172,
    "Goat Ran Ran - Noisy Hall 3": 173,
    "Goat Ran Ran - Bad Feeling Spot 1": 174,
    "Goat Ran Ran - Bad Feeling Spot 2": 175,
    "Goat Ran Ran - Bad Feeling Spot 3": 176,
    "Goat Ran Ran - Discover Blowfish": 177,
    "Goat Ran Ran - Discover Swirl": 178,
    "Goat Ran Ran - Discover Search": 179,
    "Goat Ran Ran - Generic Spot 1": 180,
    "Goat Ran Ran - Generic Spot 2": 181,
    "Goat Ran Ran - Generic Spot 3": 182,
    "Goat Ran Ran - Generic Spot 4": 183,
    "Goat Ran Ran - Generic Spot 5": 184,
    "Goat Ran Ran - Generic Spot 6": 185,
    "Goat Ran Ran - Generic Spot 7": 186,
    "Goat Ran Ran - Generic Spot 8": 187,
    "Goat Ran Ran - Generic Spot 9": 188,
    "Goat Ran Ran - Generic Spot 10": 189,

    # TODO: Shop locations
}

# Generation-only event locations (These intentionally have no AP location IDs)
event_locations = {
    "Cleared Rank E Tochikan",
    "Cleared Rank D Tochikan",
    "Cleared Rank C Tochikan",
    "Cleared Rank B Tochikan",
    "Cleared Rank A Tochikan",
    "Cleared Rank S Tochikan",
}

all_locations = {**rank_locations, **regional_locations}

location_groups = {
    "Ran Ran Lords":
    {
        "Kalaragi Ran Ran - Visit Lord",
        "Brillia Ran Ran - Visit Lord",
        "Goat Ran Ran - Visit Lord",
        "Morx Ran Ran - Visit Lord",
        "Takrama Ran Ran - Visit Lord"
    },
    "Ran Ran Noisy Halls":
    {
        "Kalaragi Ran Ran - Noisy Hall 1",
        "Kalaragi Ran Ran - Noisy Hall 2",
        "Kalaragi Ran Ran - Noisy Hall 3",
        "Brillia Ran Ran - Noisy Hall 1",
        "Brillia Ran Ran - Noisy Hall 2",
        "Brillia Ran Ran - Noisy Hall 3",
        "Goat Ran Ran - Noisy Hall 1",
        "Goat Ran Ran - Noisy Hall 2",
        "Goat Ran Ran - Noisy Hall 3",
        "Morx Ran Ran - Noisy Hall 1",
        "Morx Ran Ran - Noisy Hall 2",
        "Morx Ran Ran - Noisy Hall 3",
        "Takrama Ran Ran - Noisy Hall 1",
        "Takrama Ran Ran - Noisy Hall 2",
        "Takrama Ran Ran - Noisy Hall 3"
    },
    "Ran Ran Bad Feeling Spots":
    {
        "Kalaragi Ran Ran - Bad Feeling Spot 1",
        "Kalaragi Ran Ran - Bad Feeling Spot 2",
        "Kalaragi Ran Ran - Bad Feeling Spot 3",
        "Brillia Ran Ran - Bad Feeling Spot 1",
        "Brillia Ran Ran - Bad Feeling Spot 2",
        "Brillia Ran Ran - Bad Feeling Spot 3",
        "Goat Ran Ran - Bad Feeling Spot 1",
        "Goat Ran Ran - Bad Feeling Spot 2",
        "Goat Ran Ran - Bad Feeling Spot 3",
        "Morx Ran Ran - Bad Feeling Spot 1",
        "Morx Ran Ran - Bad Feeling Spot 2",
        "Morx Ran Ran - Bad Feeling Spot 3",
        "Takrama Ran Ran - Bad Feeling Spot 1",
        "Takrama Ran Ran - Bad Feeling Spot 2",
        "Takrama Ran Ran - Bad Feeling Spot 3"
    },
    "Big 5 Tournaments":
    {
        "Morx All Stars",
        "Takrama Heat Challenge",
        "Kalaragi Carnival",
        "Brillia Grand Prix",
        "Goat Big Tournament"
    },
    "Rank A Tournaments": 
    {
        "Great Baum Carnivale",
        "Sandstorm Cup",
        "Tropical Rumble",
        "Blizzard Cup",
        "Maelstrom Cup"
    },
    "Rank B Tournaments":
    {
        "Harvest Festa Memorial",
        "Hot Hot Tournament",
        "Umbagi Fall Festa",
        "Aurora Tournament",
        "Wild Waves Cup"
    },
    "Rank C Tournaments":
    {
        "Asunaro Tournament",
        "Mirage Cup",
        "Squall Cup",
        "Crystal Flower Cup",
        "Red Coral Cup"
    },
    "Rank D Tournaments":
    {
        "Mushroom Cup",
        "PokePoke Bros Memorial",
        "Prickly Water Lily Cup",
        "Yukiran Memorial",
        "Seagull Tournament"
    },
    "Rank E Tournaments":
    {
        "Fresh Leaf Cup",
        "Oasis Cup",
        "Green Tournament",
        "Snow Rookie Battle",
        "Ripples Tyro Match"
    },
    "Tochikan Festas":
    {
        "Tochikan Festa - Rank E",
        "Tochikan Festa - Rank D",
        "Tochikan Festa - Rank C",
        "Tochikan Festa - Rank B",
        "Tochikan Festa - Rank A",
        "Tochikan Festa - Rank S"
    }
}