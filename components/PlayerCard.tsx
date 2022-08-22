import PlayerClass from "./PlayerClass";
import PlayerStats from "./PlayerStats";

export default function PlayerCard() {
  return (
    <div className="flex gap-10 border border-yellow-500 bg-neutral-700 p-5">
      <PlayerClass />
      <PlayerStats />
    </div>
  );
}
