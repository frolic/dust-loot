import { objects } from "@dust/world/internal";

export const objectsByType = new Map(
  objects.map((object) => [object.id, object])
);
