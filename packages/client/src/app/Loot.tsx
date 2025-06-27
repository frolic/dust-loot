import mudConfig from "@dust/world/mud.config";
import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";
import { useMemo } from "react";
import { bigIntSort, groupBy } from "@latticexyz/common/utils";
import { objectsByType } from "./objects";

export function Loot() {
  const slots = useRecords({ stash, table: mudConfig.tables.InventorySlot });
  const inventories = useMemo(() => {
    const slotObjects = slots.map((slot) => ({
      ...slot,
      object: objectsByType.get(slot.objectType),
    }));

    const slotsByOwner = groupBy(slotObjects, (slot) => slot.owner);

    return Array.from(slotsByOwner.entries())
      .map(([owner, items]) => {
        const mass = items.reduce(
          (sum, item) => sum + BigInt(item.amount) * (item.object?.mass ?? 0n),
          0n
        );
        return { owner, items, mass };
      })
      .sort((a, b) => bigIntSort(b.mass, a.mass));
  }, [slots]);

  return (
    <div className="space-y-4 p-4">
      {inventories.slice(0, 10).map((inventory) => (
        <div
          key={inventory.owner}
          className="bg-white/10 rounded p-4 inline-grid grid-cols-9 gap-1.5"
        >
          {inventory.items.map((item) => (
            <div
              key={item.slot}
              className="size-12 bg-black/30 rounded-xs p-1 inline-grid *:col-start-1 *:row-start-1"
            >
              <img
                src={`https://alpha.dustproject.org/api/assets/objects/${item.objectType}/icon`}
                className="size-full"
              />
              <span className="place-self-end bg-black text-xs leading-none p-1 -m-2 rounded">
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
