from BaseClasses import Location, LocationProgressType

# Instance Data for MR3 Locations
class MR3Location(Location):
    game = "Monster Rancher 3"

all_locations = {
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

# Generation-only event locations (These intentionally have no AP location IDs)
event_locations = {
    "Cleared Rank E Tochikan",
    "Cleared Rank D Tochikan",
    "Cleared Rank C Tochikan",
    "Cleared Rank B Tochikan",
    "Cleared Rank A Tochikan",
    "Cleared Rank S Tochikan",
}

location_groups = {
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