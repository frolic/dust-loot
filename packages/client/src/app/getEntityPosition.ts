import { EntityId, ReadonlyVec3 } from "@dust/world/internal";
import { getRecord } from "@latticexyz/stash/internal";
import { stash } from "../mud/stash";
import { tables } from "../common";

export function getEntityPosition(
  entityId: EntityId
): ReadonlyVec3 | undefined {
  const pos = getRecord({
    stash,
    table: tables.EntityPosition,
    key: { entityId },
  });
  if (pos) return [pos.x, pos.y, pos.z];

  const sleeping = getRecord({
    stash,
    table: tables.PlayerBed,
    key: { entityId },
  });
  if (sleeping) {
    const bedPos = getRecord({
      stash,
      table: tables.EntityPosition,
      key: { entityId: sleeping.bedEntityId },
    });
    if (bedPos) return [bedPos.x, bedPos.y, bedPos.z];
  }
}
