import fs from "fs";
import type { InferGetStaticPropsType } from "next";
import Image from "next/future/image";
import path from "path";
import { useState } from "react";
import IncrementButton from "../components/IncrementButton";

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
    // check for stat name to decrement over maps for each general stat
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
    // check for stat name to increment over maps for each general stat
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
      <div className="flex bg-neutral-800">
        {/* Player Class */}
        <div className="flex flex-col items-center gap-4 border border-yellow-500 p-5 pt-5">
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
        <section className="flex flex-col gap-3 border-y border-yellow-500 p-5">
          <div className="pb-3 text-xl uppercase text-white">
            Level: {playerCard.level}
          </div>
          <div className="text-xl uppercase text-white">Stats</div>
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
        <section className="flex flex-col border-y border-r border-yellow-500 px-4 pt-28 text-white">
          <div className="flex flex-col gap-2">
            {Object.entries(generalStats).map(([name, value]) => (
              <div
                key={name}
                className="flex w-40 justify-between text-sm uppercase"
              >
                <div>{name}</div>
                <div>{value}</div>
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

const LEVEL_HP_MAP = [
  0, 300, 304, 312, 322, 334, 347, 362, 378, 396, 414, 434, 455, 476, 499, 522,
  547, 572, 598, 624, 652, 680, 709, 738, 769, 800, 833, 870, 910, 951, 994,
  1037, 1081, 1125, 1170, 1216, 1262, 1308, 1355, 1402, 1450, 1476, 1503, 1529,
  1555, 1581, 1606, 1631, 1656, 1680, 1704, 1727, 1750, 1772, 1793, 1814, 1834,
  1853, 1871, 1887, 1900, 1906, 1912, 1918, 1924, 1930, 1936, 1942, 1948, 1954,
  1959, 1965, 1971, 1977, 1982, 1988, 1993, 1999, 2004, 2010, 2015, 2020, 2026,
  2031, 2036, 2041, 2046, 2051, 2056, 2060, 2065, 2070, 2074, 2078, 2082, 2086,
  2090, 2094, 2097, 2100,
];
const LEVEL_STAMINA_MAP = [
  0, 80, 81, 82, 84, 85, 87, 88, 90, 91, 92, 94, 95, 97, 98, 100, 101, 103, 105,
  106, 108, 110, 111, 113, 115, 116, 118, 120, 121, 123, 125, 126, 128, 129,
  131, 132, 134, 135, 137, 138, 140, 141, 143, 144, 146, 147, 149, 150, 152,
  153, 155, 155, 155, 155, 156, 156, 156, 157, 157, 157, 158, 158, 158, 158,
  159, 159, 159, 160, 160, 160, 161, 161, 161, 162, 162, 162, 162, 163, 163,
  163, 164, 164, 164, 165, 165, 165, 166, 166, 166, 166, 167, 167, 167, 168,
  168, 168, 169, 169, 169, 170,
];
const LEVEL_FP_MAP = [
  0, 40, 43, 46, 49, 52, 55, 58, 62, 65, 68, 71, 74, 77, 81, 84, 87, 90, 93, 96,
  100, 106, 112, 118, 124, 130, 136, 142, 148, 154, 160, 166, 172, 178, 184,
  190, 196, 202, 208, 214, 220, 226, 232, 238, 244, 250, 256, 262, 268, 274,
  280, 288, 297, 305, 313, 321, 328, 335, 341, 346, 350, 352, 355, 357, 360,
  362, 365, 367, 370, 373, 375, 378, 380, 383, 385, 388, 391, 393, 396, 398,
  401, 403, 406, 408, 411, 414, 416, 419, 421, 424, 426, 429, 432, 434, 437,
  439, 442, 444, 447, 450,
];
const LEVEL_EQUIP_LOAD_MAP = [
  0.0, 45.0, 45.0, 45.0, 45.0, 45.0, 45.0, 45.0, 45.0, 46.6, 48.2, 49.8, 51.4,
  52.9, 54.5, 56.1, 57.7, 59.3, 60.9, 62.5, 64.1, 65.6, 67.2, 68.8, 70.4, 72.0,
  73.0, 74.1, 75.2, 76.4, 77.6, 78.9, 80.2, 81.5, 82.8, 84.1, 85.4, 86.8, 88.1,
  89.5, 90.9, 92.3, 93.7, 95.1, 96.5, 97.9, 99.4, 100.8, 102.2, 103.7, 105.2,
  106.6, 108.1, 109.6, 111.0, 112.5, 114.0, 115.5, 117.0, 118.5, 120.0, 121.0,
  122.1, 123.1, 124.1, 125.1, 126.2, 127.2, 128.2, 129.2, 130.3, 131.3, 132.3,
  133.3, 134.4, 135.4, 136.4, 137.4, 138.5, 139.5, 140.5, 141.5, 142.6, 143.6,
  144.6, 145.6, 146.7, 147.7, 148.7, 149.7, 150.8, 151.8, 152.8, 153.8, 154.9,
  155.9, 156.9, 157.9, 159.0, 160.0,
];
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
    <div className="flex justify-between gap-4 text-sm">
      <div className="uppercase text-white">{name}</div>
      <div className="flex gap-2">
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
