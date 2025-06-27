import { Synced } from "./mud/Synced";
import { Loot } from "./app/Loot";

export function App() {
  return (
    <div className="bg-slate-800 text-white min-h-screen">
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
