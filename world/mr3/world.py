from worlds.AutoWorld import World
from .web_world import MR3Web
from . import regions
from .items import MR3Item, all_items, event_items
from .rules import set_rank_rules

class MR3World(World):
  game = "Monster Rancher 3"
  web = MR3Web()
  origin_region_name = "Morx"

  # Builds and Connects the Regions
  def create_regions(self) -> None:
    regions.create_regions(self)

  # Factory for AP Items
  def create_item(self, name: str) -> MR3Item:
    data = all_items[name]

    return MR3Item(
        name,
        data.classification,
        data.code,
        self.player,
    )

  # Factory for Event (Fake) Items
  def create_event(self, name: str) -> MR3Item:
    data = event_items[name]

    return MR3Item(
        name,
        data.classification,
        None,
        self.player,
    )

  # Setup Rules for Generation
  def set_rules(self) -> None:
    set_rank_rules(self)

