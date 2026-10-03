import typing
from BaseClasses import ItemClassification, Item

# Instance Data for MR3 Items
class MR3Item(Item):
    game = "Monster Rancher 3"

# Wrapper for item definitions
class ItemData(typing.NamedTuple):
    code: typing.Optional[int]
    classification: ItemClassification

all_items = {
    # Location Permits
    "Brillia Permit": ItemData(1, ItemClassification.progression),
    "Kalaragi Permit": ItemData(2, ItemClassification.progression),
    "Takrama Permit": ItemData(3, ItemClassification.progression),
    "Goat Permit": ItemData(4, ItemClassification.progression),

    # Durable Items
    "Progressive Rock": ItemData(5, ItemClassification.useful), # 3 of these: Glowing, Shining, Beaming
    "Progressive Goblet": ItemData(6, ItemClassification.useful), # 3 of these: Silver, Golden, Holy
    "Progressive Incense": ItemData(7, ItemClassification.useful), # 2 of these: Herbal, Aroma
    "Medicine Box": ItemData(8, ItemClassification.useful),

    # Seasonal Items
    "Ran Ran Leaves": ItemData(9, ItemClassification.progression),
    "Ran Ran Fruit": ItemData(10, ItemClassification.progression),
    "Ran Ran Extracts": ItemData(11, ItemClassification.progression),

    # Special Drills
    "Morx Drill - Light Learn": ItemData(20, ItemClassification.progression),
    "Morx Drill - Tunnel": ItemData(21, ItemClassification.progression),
    "Morx Drill - Hit Moles": ItemData(22, ItemClassification.progression),
    "Kalaragi Drill - Fishing": ItemData(23, ItemClassification.progression),
    "Kalaragi Drill - Chase": ItemData(24, ItemClassification.progression),
    "Kalaragi Drill - Life Risk": ItemData(25, ItemClassification.progression),
    "Takrama Drill - Tornado": ItemData(26, ItemClassification.progression),
    "Takrama Drill - Real Thing": ItemData(27, ItemClassification.progression),
    "Takrama Drill - Daruma Rock": ItemData(28, ItemClassification.progression),
    "Brillia Drill - Cross Seal": ItemData(29, ItemClassification.progression),
    "Brillia Drill - Dodge Seal": ItemData(30, ItemClassification.progression),
    "Brillia Drill - Dig Seal": ItemData(31, ItemClassification.progression),
    "Goat Drill - Blowfish": ItemData(32, ItemClassification.progression),
    "Goat Drill - Search": ItemData(33, ItemClassification.progression),
    "Goat Drill - Swirl": ItemData(34, ItemClassification.progression),

    # Tech Items
    "Aurora Orb": ItemData(100, ItemClassification.useful),
    "Flare Orb": ItemData(101, ItemClassification.useful),
    "Jade Orb": ItemData(102, ItemClassification.useful),
    "Aqua Orb": ItemData(103, ItemClassification.useful),
    "Aurora Stone": ItemData(104, ItemClassification.progression),
    "Flare Stone": ItemData(105, ItemClassification.progression),
    "Jade Stone": ItemData(106, ItemClassification.progression),
    "Aqua Stone": ItemData(107, ItemClassification.progression),
    "Flare Bit": ItemData(108, ItemClassification.progression),
    "Jade Bit": ItemData(109, ItemClassification.progression),
    "Aqua Bit": ItemData(110, ItemClassification.progression),
    "Aurora Bit": ItemData(111, ItemClassification.progression),

    # Money
    "100g": ItemData(300000, ItemClassification.filler),
    "500g": ItemData(300001, ItemClassification.filler),
}

# Generation-only event items (These have no AP item ID and are never sent to the client/server)
event_items = {
    "Cleared Rank E Tochikan": ItemData(None, ItemClassification.progression),
    "Cleared Rank D Tochikan": ItemData(None, ItemClassification.progression),
    "Cleared Rank C Tochikan": ItemData(None, ItemClassification.progression),
    "Cleared Rank B Tochikan": ItemData(None, ItemClassification.progression),
    "Cleared Rank A Tochikan": ItemData(None, ItemClassification.progression),
    "Cleared Rank S Tochikan": ItemData(None, ItemClassification.progression),
}