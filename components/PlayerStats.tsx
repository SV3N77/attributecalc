export default function PlayerStats() {
  return (
    <section className="flex flex-col gap-4">
      <div className="text-xl text-white">Stats</div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <div className="text-white">Vigor</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Mind</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Endurance</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Strength</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Dexterity</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Intelligence</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Faith</div>
          <div className="text-white">10</div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="text-white">Arcane</div>
          <div className="text-white">10</div>
        </div>
      </div>
    </section>
  );
}
