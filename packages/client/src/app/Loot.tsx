import mudConfig from "@dust/world/mud.config";
import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";

export function Loot() {
  const slots = useRecords({ stash, table: mudConfig.tables.InventorySlot });
  return <>slots: {slots.length}</>;
}
