import type { NextPage } from "next";
import Image from "next/future/image";
import { useEffect, useState } from "react";
import IncrementButton from "../components/IncrementButton";
import { PlayerCards } from "./api/characters";

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
  const [characters, setCharacters] = useState<PlayerCards[]>();
  const [playerCard, setPlayerCard] = useState<PlayerCards>({
    class: "wretch",
    level: 1,
    playerStats: {
      vigor: 10,
      mind: 10,
      endurance: 10,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      faith: 10,
      arcane: 10,
    },
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats>(
    playerCard.playerStats
  );
  useEffect(() => {
    async function fetchCharacters() {
      const res = await fetch("http://localhost:3000/api/characters");
      const data = await res.json();
      setCharacters({ ...data });
    }
    fetchCharacters();
  }, []);

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

  function decrementClass(nameClass: string) {
    if (characters) {
      const currentClass = Object.entries(characters).findIndex(
        ([index, character]) => {
          return character.class === nameClass;
        }
      );
      setPlayerCard(characters[currentClass - 1]);
      setPlayerStats(playerCard.playerStats);
      console.log(playerCard);
    }
  }

  function incrementClass(nameClass: string) {
    if (characters) {
      const currentClass = Object.entries(characters).findIndex(
        ([index, character]) => {
          return character.class === nameClass;
        }
      );
      setPlayerCard(characters[currentClass + 1]);
      setPlayerStats(playerCard.playerStats);
      console.log(playerCard);
    }
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="flex gap-10 border border-yellow-500 bg-neutral-700 p-5">
        {/* Player Class */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full justify-between gap-4 px-4">
            <IncrementButton onClick={() => decrementClass(playerCard.class)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </IncrementButton>
            <div className="text-2xl capitalize text-white">
              {playerCard.class}
            </div>
            <IncrementButton onClick={() => incrementClass(playerCard.class)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </IncrementButton>
          </div>
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
          <div className="pb-6 text-xl text-white">Stats</div>
          <div className="text-xl text-white">Level: {playerCard.level}</div>
          <div className="flex flex-col gap-4">
            {Object.entries(playerStats).map(([name, value]) => (
              <Stat
                key={name}
                name={name as keyof PlayerStats}
                value={value}
                limit={playerCard.playerStats[name as keyof PlayerStats]}
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
  limit: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

function Stat({ name, value, limit, onDecrement, onIncrement }: StatProps) {
  return (
    <div className="flex justify-between gap-4">
      <div className="capitalize text-white">{name}</div>
      <div className="flex gap-2 ">
        <IncrementButton disabled={value <= limit} onClick={onDecrement}>
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
        <IncrementButton disabled={value >= 99} onClick={onIncrement}>
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
