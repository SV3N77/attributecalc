import fs from "fs";
import type { InferGetStaticPropsType } from "next";
import Image from "next/future/image";
import path from "path";
import { useState } from "react";
import IncrementButton from "../components/IncrementButton";
import { LEVEL_HP_MAP } from "./maps/level-hp-map";
import { LEVEL_FP_MAP } from "./maps/level-fp-map";
import { LEVEL_EQUIP_LOAD_MAP } from "./maps/level-equip-load-map";
import { LEVEL_STAMINA_MAP } from "./maps/level-stamina-map";

// initiate PlayerStats type
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
// initiate general stats type
type GeneralStats = {
  hp: number;
  fp: number;
  stamina: number;
  "equip load": number;
  poise: number;
  discovery: number;
};
// initiate PlayerCard type
type PlayerCard = {
  class: string;
  level: number;
  playerStats: PlayerStats;
  generalStats: GeneralStats;
};
// get data from characters.json file in json folder
export async function getStaticProps() {
  const jsonDirectory = path.join(process.cwd(), "json");
  const jsonFiles = await fs.readFileSync(
    jsonDirectory + "/characters.json",
    "utf8"
  );
  const data = JSON.parse(jsonFiles) as { [key: string]: PlayerCard };
  return {
    props: {
      characters: data,
    },
  };
}

function Home({ characters }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [playerCard, setPlayerCard] = useState<PlayerCard>({
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
    generalStats: {
      hp: 414,
      fp: 78,
      stamina: 96,
      "equip load": 48.2,
      poise: 0,
      discovery: 110,
    },
  });
  const [playerStats, setPlayerStats] = useState<PlayerStats>(
    playerCard.playerStats
  );
  const [generalStats, setGeneralStats] = useState<GeneralStats>(
    playerCard.generalStats
  );

  function decrementStat(name: keyof PlayerStats) {
    // decrement each stat seperately
    setPlayerStats((prev) => {
      return { ...prev, [name]: prev[name] - 1 };
    });
    // decrement level
    setPlayerCard((prev) => {
      return { ...prev, level: prev.level - 1 };
    });

    if (name === "vigor") {
      setGeneralStats((prev) => {
        return { ...prev, hp: LEVEL_HP_MAP[playerStats.vigor - 1] };
      });
    } else if (name === "mind") {
      setGeneralStats((prev) => {
        return { ...prev, fp: LEVEL_FP_MAP[playerStats.mind - 1] };
      });
    } else if (name === "endurance") {
      setGeneralStats((prev) => {
        return {
          ...prev,
          "equip load": LEVEL_EQUIP_LOAD_MAP[playerStats.endurance - 1],
          stamina: LEVEL_STAMINA_MAP[playerStats.endurance - 1],
        };
      });
    } else if (name === "arcane") {
      setGeneralStats((prev) => {
        return { ...prev, discovery: prev.discovery - 1 };
      });
    }
  }

  function incrementStat(name: keyof PlayerStats) {
    // increment each stat seperately
    setPlayerStats((prev) => {
      return { ...prev, [name]: prev[name] + 1 };
    });
    // increment level
    setPlayerCard((prev) => {
      return { ...prev, level: prev.level + 1 };
    });

    if (name === "vigor") {
      setGeneralStats((prev) => {
        return { ...prev, hp: LEVEL_HP_MAP[playerStats.vigor + 1] };
      });
    } else if (name === "mind") {
      setGeneralStats((prev) => {
        return { ...prev, fp: LEVEL_FP_MAP[playerStats.mind + 1] };
      });
    } else if (name === "endurance") {
      setGeneralStats((prev) => {
        return {
          ...prev,
          "equip load": LEVEL_EQUIP_LOAD_MAP[playerStats.endurance + 1],
          stamina: LEVEL_STAMINA_MAP[playerStats.endurance + 1],
        };
      });
    } else if (name === "arcane") {
      setGeneralStats((prev) => {
        return { ...prev, discovery: prev.discovery + 1 };
      });
    }
  }

  function decrementClass() {
    // gets index from object characters
    const currentClass = Object.keys(characters).findIndex(
      (className) => className === playerCard.class
    );
    // assign array to characters object
    const charactersArray = Object.values(characters);
    // assign previous PLayerCard to prevClass
    const prevClass = charactersArray.at(
      (currentClass - 1) % charactersArray.length
    )!;
    // set new state
    setPlayerCard(prevClass);
    setPlayerStats(prevClass.playerStats);
    setGeneralStats(prevClass.generalStats);
  }

  function incrementClass() {
    // gets index from object characters
    const currentClass = Object.keys(characters).findIndex(
      (className) => className === playerCard.class
    );
    // assign array to characters object
    const charactersArray = Object.values(characters);
    // assign next PLayerCard to nextClass
    const nextClass = charactersArray.at(
      (currentClass + 1) % charactersArray.length
    )!;
    // set new state
    setPlayerCard(nextClass);
    setPlayerStats(nextClass.playerStats);
    setGeneralStats(nextClass.generalStats);
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="flex gap-10 border border-yellow-500 bg-neutral-700 p-5">
        {/* Player Class */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex w-full justify-between gap-4 px-4">
            <IncrementButton onClick={() => decrementClass()}>
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
            <div className="text-2xl uppercase text-white">
              {playerCard.class}
            </div>
            <IncrementButton onClick={() => incrementClass()}>
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
            src={`/images/${playerCard.class}.webp`}
            alt="Samurai"
            width={450}
            height={600}
            priority
          />
        </div>
        {/* Player Stats */}
        <section className="flex flex-col gap-3">
          <div className="py-3 text-xl uppercase text-white">
            Level: {playerCard.level}
          </div>
          <div className=" pb-4 text-xl uppercase text-white">Stats</div>
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
        {/* Genreal stats */}
        <section className="flex flex-col gap-4 py-16 px-2 text-white">
          <div className="flex flex-col gap-2">
            {Object.entries(generalStats).map(([name, value]) => (
              <div key={name} className=" flex w-32 justify-between uppercase">
                <div>{name}</div>
                <div> {value} </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;

// Internal Componenets
// set type of props to pass in Stat function
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
      <div className="uppercase text-white">{name}</div>
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

// function
