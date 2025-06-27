import { Synced } from "./mud/Synced";
import { Loot } from "./app/Loot";
import { useDustClient } from "./useDustClient";

export function App() {
  useDustClient();
  return (
    <div className="min-h-screen text-white not-dust-app:bg-slate-800">
      <Synced
        fallback={({ message, percentage }) => (
          <div className="fixed inset-0 grid place-items-center p-4 tabular-nums">
            {message} ({percentage.toFixed(1)}%)…
          </div>
        )}
      >
        <Loot />
      </Synced>
    </div>
  );
}
