import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";
import { useMemo } from "react";
import { bigIntSort, groupBy } from "@latticexyz/common/utils";
import { objectsByType } from "./objects";
import { tables } from "../common";
import { getEntityPosition } from "./getEntityPosition";
import { useDustClient } from "../useDustClient";

export function Loot() {
  const { data: dustClient } = useDustClient();
  const slots = useRecords({ stash, table: tables.InventorySlot });

  const inventories = useMemo(() => {
    const slotObjects = slots
      .map((slot) => ({
        ...slot,
        object: objectsByType.get(slot.objectType),
      }))
      .sort((a, b) => a.slot - b.slot);

    const slotsByOwner = groupBy(slotObjects, (slot) => slot.owner);

    return Array.from(slotsByOwner.entries())
      .map(([owner, items]) => {
        const mass = items.reduce(
          (sum, item) => sum + BigInt(item.amount) * (item.object?.mass ?? 0n),
          0n
        );

        return {
          owner,
          items,
          mass,
          position: getEntityPosition(owner),
        };
      })
      .sort((a, b) => bigIntSort(b.mass, a.mass));
  }, [slots]);

  return (
    <div className="max-w-screen-sm mx-auto space-y-8 p-8">
      {inventories.slice(0, 10).map((inventory) => (
        <div>
          <div className="text-center">
            {/* TODO: player vs chest vs drop */}
            <button
              type="button"
              className="cursor-pointer text-yellow-200 disabled:pointer-events-none disabled:text-white/50"
              disabled={!dustClient || !inventory.position}
              onClick={() => {
                dustClient?.provider.request({
                  method: "setWaypoint",
                  params: { entity: inventory.owner, label: "Loot" },
                });
              }}
            >
              {inventory.position ? (
                <>{inventory.position.join(", ")}</>
              ) : (
                <>Unknown location</>
              )}
            </button>
          </div>
          <div key={inventory.owner} className="inline-grid grid-cols-9 gap-1">
            {inventory.items.map((item) => (
              <div
                key={item.slot}
                className="aspect-square bg-slate-950/30 rounded p-1 inline-grid *:col-start-1 *:row-start-1"
              >
                <img
                  src={`https://alpha.dustproject.org/api/assets/objects/${item.objectType}/icon`}
                  className="size-full"
                />
                <span className="place-self-end text-sm leading-none backdrop-blur px-1 p-0.5 rounded overflow-hidden">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
