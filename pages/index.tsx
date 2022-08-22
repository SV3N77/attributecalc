import type { NextPage } from "next";
import Image from "next/future/image";
import { useState } from "react";
import IncrementButton from "../components/IncrementButton";

type PlayerStats = {
  vigor: number;
  mind: number;
  endurance: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  arcane: number;
};

const Home: NextPage = () => {
  const [playerClass, setPlayerClass] = useState("Wretch");
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    vigor: 10,
    mind: 10,
    endurance: 10,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    faith: 10,
    arcane: 10,
  });

  function decrementStat(name: keyof PlayerStats) {
    setPlayerStats((prev) => {
      return { ...prev, [name]: prev[name] - 1 };
    });
  }
  function incrementStat(name: keyof PlayerStats) {
    setPlayerStats((prev) => {
      return { ...prev, [name]: prev[name] + 1 };
    });
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="flex gap-10 border border-yellow-500 bg-neutral-700 p-5">
        {/* Player Class */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-2xl text-white">{playerClass}</div>
          <Image
            className="aspect-[3/4]"
            src="/images/wretch.webp"
            alt="Samurai"
            width={450}
            height={600}
          />
        </div>
        {/* Player Stats */}
        <section className="flex flex-col gap-4">
          <div className="pb-8 text-xl text-white">Stats</div>
          <div className="flex flex-col gap-4">
            {Object.entries(playerStats).map(([name, value]) => (
              <Stat
                key={name}
                name={name as keyof PlayerStats}
                value={value}
                onDecrement={() => decrementStat(name as keyof PlayerStats)}
                onIncrement={() => incrementStat(name as keyof PlayerStats)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

// Internal Componenets

type StatProps = {
  name: keyof PlayerStats;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

function Stat({ name, value, onDecrement, onIncrement }: StatProps) {
  return (
    <div className="flex justify-between gap-4">
      <div className="capitalize text-white">{name}</div>
      <div className="flex gap-2 ">
        <IncrementButton onClick={onDecrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </IncrementButton>
        <div className="w-6 text-center text-white">{value}</div>
        <IncrementButton onClick={onIncrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </IncrementButton>
      </div>
    </div>
  );
}
