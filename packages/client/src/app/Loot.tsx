import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";
import { useMemo } from "react";
import { bigIntSort, groupBy } from "@latticexyz/common/utils";
import { objectsByType } from "./objects";
import { tables } from "../common";
import { getEntityPosition } from "./getEntityPosition";
import { useDustClient } from "../useDustClient";
import { twMerge } from "tailwind-merge";

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
      {inventories.slice(0, 20).map((inventory) => (
        <div className="grid *:col-start-1 *:row-start-1">
          <div
            key={inventory.owner}
            className="inline-grid grid-cols-9 gap-1.5 p-3 bg-slate-950/30 rounded"
          >
            {inventory.items.map((item) => (
              <div
                key={item.slot}
                className="aspect-square rounded inline-grid *:col-start-1 *:row-start-1"
              >
                <img
                  src={`https://alpha.dustproject.org/api/assets/objects/${item.objectType}/icon`}
                  className="size-full"
                />
                <span className="place-self-end text-sm leading-none backdrop-blur bg-black/20 px-1 py-0.5 rounded overflow-hidden">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
          <div className="self-start justify-self-center -translate-y-1/2">
            {/* TODO: player vs chest vs drop */}
            <button
              type="button"
              className={twMerge(
                "cursor-pointer",
                "backdrop-blur p-1.5 rounded text-xs leading-none",
                "bg-slate-950/40 hover:bg-yellow-900/60 active:bg-yellow-950/60",
                "font-semibold text-yellow-200 disabled:pointer-events-none disabled:text-white/60"
              )}
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
        </div>
      ))}
    </div>
  );
}
