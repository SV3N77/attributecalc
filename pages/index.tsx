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
// runes type
type Runes = {
  runes: number;
  increase: number;
  total: number;
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
  const [runes, setRunes] = useState<Runes>(LEVEL_RUNES_MAP[1]);

  function decrementStat(name: keyof PlayerStats) {
    // decrement each stat seperately
    setPlayerStats((prev) => {
      return { ...prev, [name]: prev[name] - 1 };
    });
    // decrement level
    setPlayerCard((prev) => {
      return { ...prev, level: prev.level - 1 };
    });
    // decrement runes according to level
    const currentRune = Object.keys(LEVEL_RUNES_MAP).findIndex(
      (index) => index === playerCard.level.toString()
    );
    const runeArray = Object.values(LEVEL_RUNES_MAP);
    const prevRune = runeArray.at(currentRune - 1)!;
    setRunes(prevRune);
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
    // increment runes according to level
    const currentRune = Object.keys(LEVEL_RUNES_MAP).findIndex(
      (index) => index === playerCard.level.toString()
    );
    const runeArray = Object.values(LEVEL_RUNES_MAP);
    const nextRune = runeArray.at(currentRune + 1)!;

    setRunes(nextRune);

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
        <section className="flex flex-col gap-4 border-y border-r border-yellow-500 px-4 pt-4 text-sm text-white">
          <div className="flex flex-col gap-2 pb-8">
            <div className="flex justify-between">
              <div>To Next Level</div>
              <div>{runes.runes}</div>
            </div>
            <div className="flex justify-between">
              <div>Total Runes</div>
              <div>{runes.total}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {Object.entries(generalStats).map(([name, value]) => (
              <div key={name} className="flex w-56 justify-between uppercase">
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
const LEVEL_RUNES_MAP = {
  "1": { runes: 673, increase: 0, total: 0 },
  "2": { runes: 689, increase: 16, total: 673 },
  "3": { runes: 706, increase: 17, total: 1_362 },
  "4": { runes: 723, increase: 17, total: 2_068 },
  "5": { runes: 740, increase: 17, total: 2_791 },
  "6": { runes: 757, increase: 17, total: 3_531 },
  "7": { runes: 775, increase: 18, total: 4_288 },
  "8": { runes: 793, increase: 18, total: 5_063 },
  "9": { runes: 811, increase: 18, total: 5_856 },
  "10": { runes: 829, increase: 18, total: 6_667 },
  "11": { runes: 847, increase: 18, total: 7_496 },
  "12": { runes: 1_038, increase: 191, total: 8_343 },
  "13": { runes: 1_238, increase: 200, total: 9_381 },
  "14": { runes: 1_445, increase: 207, total: 10_619 },
  "15": { runes: 1_659, increase: 214, total: 12_064 },
  "16": { runes: 1_882, increase: 223, total: 13_723 },
  "17": { runes: 2_113, increase: 231, total: 15_605 },
  "18": { runes: 2_353, increase: 240, total: 17_718 },
  "19": { runes: 2_601, increase: 248, total: 20_071 },
  "20": { runes: 2_857, increase: 256, total: 22_672 },
  "21": { runes: 3_122, increase: 265, total: 25_529 },
  "22": { runes: 3_395, increase: 273, total: 28_651 },
  "23": { runes: 3_678, increase: 283, total: 32_046 },
  "24": { runes: 3_970, increase: 292, total: 35_724 },
  "25": { runes: 4_270, increase: 300, total: 39_694 },
  "26": { runes: 4_580, increase: 310, total: 43_964 },
  "27": { runes: 4_899, increase: 319, total: 48_544 },
  "28": { runes: 5_228, increase: 329, total: 53_443 },
  "29": { runes: 5_567, increase: 339, total: 58_671 },
  "30": { runes: 5_915, increase: 348, total: 64_238 },
  "31": { runes: 6_273, increase: 358, total: 70_153 },
  "32": { runes: 6_640, increase: 367, total: 76_426 },
  "33": { runes: 7_018, increase: 378, total: 83_066 },
  "34": { runes: 7_407, increase: 389, total: 90_084 },
  "35": { runes: 7_805, increase: 398, total: 97_491 },
  "36": { runes: 8_214, increase: 409, total: 105_296 },
  "37": { runes: 8_633, increase: 419, total: 113_510 },
  "38": { runes: 9_064, increase: 431, total: 122_143 },
  "39": { runes: 9_505, increase: 441, total: 131_207 },
  "40": { runes: 9_956, increase: 451, total: 140_712 },
  "41": { runes: 10_419, increase: 463, total: 150_668 },
  "42": { runes: 10_893, increase: 474, total: 161_087 },
  "43": { runes: 11_379, increase: 486, total: 171_980 },
  "44": { runes: 11_876, increase: 497, total: 183_359 },
  "45": { runes: 12_384, increase: 508, total: 195_235 },
  "46": { runes: 12_904, increase: 520, total: 207_619 },
  "47": { runes: 13_435, increase: 531, total: 220_523 },
  "48": { runes: 13_979, increase: 544, total: 233_958 },
  "49": { runes: 14_535, increase: 556, total: 247_937 },
  "50": { runes: 15_102, increase: 567, total: 262_472 },
  "51": { runes: 15_682, increase: 580, total: 277_574 },
  "52": { runes: 16_274, increase: 592, total: 293_256 },
  "53": { runes: 16_879, increase: 605, total: 309_530 },
  "54": { runes: 17_497, increase: 618, total: 326_409 },
  "55": { runes: 18_127, increase: 630, total: 343_906 },
  "56": { runes: 18_770, increase: 643, total: 362_033 },
  "57": { runes: 19_425, increase: 655, total: 380_803 },
  "58": { runes: 20_094, increase: 669, total: 400_228 },
  "59": { runes: 20_777, increase: 683, total: 420_322 },
  "60": { runes: 21_472, increase: 695, total: 441_099 },
  "61": { runes: 22_181, increase: 709, total: 462_571 },
  "62": { runes: 22_903, increase: 722, total: 484_752 },
  "63": { runes: 23_640, increase: 737, total: 507_655 },
  "64": { runes: 24_390, increase: 750, total: 531_295 },
  "65": { runes: 25_153, increase: 763, total: 555_685 },
  "66": { runes: 25_931, increase: 778, total: 580_838 },
  "67": { runes: 26_723, increase: 792, total: 606_769 },
  "68": { runes: 27_530, increase: 807, total: 633_492 },
  "69": { runes: 28_351, increase: 821, total: 661_022 },
  "70": { runes: 29_186, increase: 835, total: 689_373 },
  "71": { runes: 30_036, increase: 850, total: 718_559 },
  "72": { runes: 30_900, increase: 864, total: 748_595 },
  "73": { runes: 31_780, increase: 880, total: 779_495 },
  "74": { runes: 32_675, increase: 895, total: 811_275 },
  "75": { runes: 33_584, increase: 909, total: 843_950 },
  "76": { runes: 34_509, increase: 925, total: 877_534 },
  "77": { runes: 35_449, increase: 940, total: 912_043 },
  "78": { runes: 36_405, increase: 956, total: 947_492 },
  "79": { runes: 37_377, increase: 972, total: 983_897 },
  "80": { runes: 38_364, increase: 987, total: 1_021_274 },
  "81": { runes: 39_367, increase: 1_003, total: 1_059_638 },
  "82": { runes: 40_385, increase: 1_018, total: 1_099_005 },
  "83": { runes: 41_420, increase: 1_035, total: 1_139_390 },
  "84": { runes: 42_472, increase: 1_052, total: 1_180_810 },
  "85": { runes: 43_539, increase: 1_067, total: 1_223_282 },
  "86": { runes: 44_623, increase: 1_084, total: 1_266_821 },
  "87": { runes: 45_723, increase: 1_100, total: 1_311_444 },
  "88": { runes: 46_841, increase: 1_118, total: 1_357_167 },
  "89": { runes: 47_975, increase: 1_134, total: 1_404_008 },
  "90": { runes: 49_125, increase: 1_150, total: 1_451_983 },
  "91": { runes: 50_293, increase: 1_168, total: 1_501_108 },
  "92": { runes: 51_478, increase: 1_185, total: 1_551_401 },
  "93": { runes: 52_681, increase: 1_203, total: 1_602_879 },
  "94": { runes: 53_901, increase: 1_220, total: 1_655_560 },
  "95": { runes: 55_138, increase: 1_237, total: 1_709_461 },
  "96": { runes: 56_393, increase: 1_255, total: 1_764_599 },
  "97": { runes: 57_665, increase: 1_272, total: 1_820_992 },
  "98": { runes: 58_956, increase: 1_291, total: 1_878_657 },
  "99": { runes: 60_265, increase: 1_309, total: 1_937_613 },
  "100": { runes: 61_591, increase: 1_326, total: 1_997_878 },
  "101": { runes: 62_936, increase: 1_345, total: 2_059_469 },
  "102": { runes: 64_299, increase: 1_363, total: 2_122_405 },
  "103": { runes: 65_681, increase: 1_382, total: 2_186_704 },
  "104": { runes: 67_082, increase: 1_401, total: 2_252_385 },
  "105": { runes: 68_501, increase: 1_419, total: 2_319_467 },
  "106": { runes: 69_939, increase: 1_438, total: 2_387_968 },
  "107": { runes: 71_395, increase: 1_456, total: 2_457_907 },
  "108": { runes: 72_871, increase: 1_476, total: 2_529_302 },
  "109": { runes: 74_367, increase: 1_496, total: 2_602_173 },
  "110": { runes: 75_881, increase: 1_514, total: 2_676_540 },
  "111": { runes: 77_415, increase: 1_534, total: 2_752_421 },
  "112": { runes: 78_968, increase: 1_553, total: 2_829_836 },
  "113": { runes: 80_542, increase: 1_574, total: 2_908_804 },
  "114": { runes: 82_135, increase: 1_593, total: 2_989_346 },
  "115": { runes: 83_747, increase: 1_612, total: 3_071_481 },
  "116": { runes: 85_380, increase: 1_633, total: 3_155_228 },
  "117": { runes: 87_033, increase: 1_653, total: 3_240_608 },
  "118": { runes: 88_707, increase: 1_674, total: 3_327_641 },
  "119": { runes: 90_401, increase: 1_694, total: 3_416_348 },
  "120": { runes: 92_115, increase: 1_714, total: 3_506_749 },
  "121": { runes: 93_850, increase: 1_735, total: 3_598_864 },
  "122": { runes: 95_605, increase: 1_755, total: 3_692_714 },
  "123": { runes: 97_382, increase: 1_777, total: 3_788_319 },
  "124": { runes: 99_180, increase: 1_798, total: 3_885_701 },
  "125": { runes: 100_998, increase: 1_818, total: 3_984_881 },
  "126": { runes: 102_838, increase: 1_840, total: 4_085_879 },
  "127": { runes: 104_699, increase: 1_861, total: 4_188_717 },
  "128": { runes: 106_582, increase: 1_883, total: 4_293_416 },
  "129": { runes: 108_487, increase: 1_905, total: 4_399_998 },
  "130": { runes: 110_413, increase: 1_926, total: 4_508_485 },
  "131": { runes: 112_361, increase: 1_948, total: 4_618_898 },
  "132": { runes: 114_330, increase: 1_969, total: 4_731_259 },
  "133": { runes: 116_322, increase: 1_992, total: 4_845_589 },
  "134": { runes: 118_337, increase: 2_015, total: 4_961_911 },
  "135": { runes: 120_373, increase: 2_036, total: 5_080_248 },
  "136": { runes: 122_432, increase: 2_059, total: 5_200_621 },
  "137": { runes: 124_513, increase: 2_081, total: 5_323_053 },
  "138": { runes: 126_618, increase: 2_105, total: 5_447_566 },
  "139": { runes: 128_745, increase: 2_127, total: 5_574_184 },
  "140": { runes: 130_894, increase: 2_149, total: 5_702_929 },
  "141": { runes: 133_067, increase: 2_173, total: 5_833_823 },
  "142": { runes: 135_263, increase: 2_196, total: 5_966_890 },
  "143": { runes: 137_483, increase: 2_220, total: 6_102_153 },
  "144": { runes: 139_726, increase: 2_243, total: 6_239_636 },
  "145": { runes: 141_992, increase: 2_266, total: 6_379_362 },
  "146": { runes: 144_282, increase: 2_290, total: 6_521_354 },
  "147": { runes: 146_595, increase: 2_313, total: 6_665_636 },
  "148": { runes: 148_933, increase: 2_338, total: 6_812_231 },
  "149": { runes: 151_295, increase: 2_362, total: 6_961_164 },
  "150": { runes: 153_680, increase: 2_385, total: 7_112_459 },
  "151": { runes: 156_090, increase: 2_410, total: 7_266_139 },
  "152": { runes: 158_524, increase: 2_434, total: 7_422_229 },
  "153": { runes: 160_983, increase: 2_459, total: 7_580_753 },
  "154": { runes: 163_467, increase: 2_484, total: 7_741_736 },
  "155": { runes: 165_975, increase: 2_508, total: 7_905_203 },
  "156": { runes: 168_508, increase: 2_533, total: 8_071_178 },
  "157": { runes: 171_065, increase: 2_557, total: 8_239_686 },
  "158": { runes: 173_648, increase: 2_583, total: 8_410_751 },
  "159": { runes: 176_257, increase: 2_609, total: 8_584_399 },
  "160": { runes: 178_890, increase: 2_633, total: 8_760_656 },
  "161": { runes: 181_549, increase: 2_659, total: 8_939_546 },
  "162": { runes: 184_233, increase: 2_684, total: 9_121_095 },
  "163": { runes: 186_944, increase: 2_711, total: 9_305_328 },
  "164": { runes: 189_680, increase: 2_736, total: 9_492_272 },
  "165": { runes: 192_441, increase: 2_761, total: 9_681_952 },
  "166": { runes: 195_229, increase: 2_788, total: 9_874_393 },
  "167": { runes: 198_043, increase: 2_814, total: 10_069_622 },
  "168": { runes: 200_884, increase: 2_841, total: 10_267_665 },
  "169": { runes: 203_751, increase: 2_867, total: 10_468_549 },
  "170": { runes: 206_644, increase: 2_893, total: 10_672_300 },
  "171": { runes: 209_564, increase: 2_920, total: 10_878_944 },
  "172": { runes: 212_510, increase: 2_946, total: 11_088_508 },
  "173": { runes: 215_484, increase: 2_974, total: 11_301_018 },
  "174": { runes: 218_485, increase: 3_001, total: 11_516_502 },
  "175": { runes: 221_512, increase: 3_027, total: 11_734_987 },
  "176": { runes: 224_567, increase: 3_055, total: 11_956_499 },
  "177": { runes: 227_649, increase: 3_082, total: 12_181_066 },
  "178": { runes: 230_759, increase: 3_110, total: 12_408_715 },
  "179": { runes: 233_897, increase: 3_138, total: 12_639_474 },
  "180": { runes: 237_062, increase: 3_165, total: 12_873_371 },
  "181": { runes: 240_255, increase: 3_193, total: 13_110_433 },
  "182": { runes: 243_475, increase: 3_220, total: 13_350_688 },
  "183": { runes: 246_724, increase: 3_249, total: 13_594_163 },
  "184": { runes: 250_002, increase: 3_278, total: 13_840_887 },
  "185": { runes: 253_307, increase: 3_305, total: 14_090_889 },
  "186": { runes: 256_641, increase: 3_334, total: 14_344_196 },
  "187": { runes: 260_003, increase: 3_362, total: 14_600_837 },
  "188": { runes: 263_395, increase: 3_392, total: 14_860_840 },
  "189": { runes: 266_815, increase: 3_420, total: 15_124_235 },
  "190": { runes: 270_263, increase: 3_448, total: 15_391_050 },
  "191": { runes: 273_741, increase: 3_478, total: 15_661_313 },
  "192": { runes: 277_248, increase: 3_507, total: 15_935_054 },
  "193": { runes: 280_785, increase: 3_537, total: 16_212_302 },
  "194": { runes: 284_351, increase: 3_566, total: 16_493_087 },
  "195": { runes: 287_946, increase: 3_595, total: 16_777_438 },
  "196": { runes: 291_571, increase: 3_625, total: 17_065_384 },
  "197": { runes: 295_225, increase: 3_654, total: 17_356_955 },
  "198": { runes: 298_910, increase: 3_685, total: 17_652_180 },
  "199": { runes: 302_625, increase: 3_715, total: 17_951_090 },
  "200": { runes: 306_369, increase: 3_744, total: 18_253_715 },
  "201": { runes: 310_144, increase: 3_775, total: 18_560_084 },
  "202": { runes: 313_949, increase: 3_805, total: 18_870_228 },
  "203": { runes: 317_785, increase: 3_836, total: 19_184_177 },
  "204": { runes: 321_652, increase: 3_867, total: 19_501_962 },
  "205": { runes: 325_549, increase: 3_897, total: 19_823_614 },
  "206": { runes: 329_477, increase: 3_928, total: 20_149_163 },
  "207": { runes: 333_435, increase: 3_958, total: 20_478_640 },
  "208": { runes: 337_425, increase: 3_990, total: 20_812_075 },
  "209": { runes: 341_447, increase: 4_022, total: 21_149_500 },
  "210": { runes: 345_499, increase: 4_052, total: 21_490_947 },
  "211": { runes: 349_583, increase: 4_084, total: 21_836_446 },
  "212": { runes: 353_698, increase: 4_115, total: 22_186_029 },
  "213": { runes: 357_846, increase: 4_148, total: 22_539_727 },
  "214": { runes: 362_025, increase: 4_179, total: 22_897_573 },
  "215": { runes: 366_235, increase: 4_210, total: 23_259_598 },
  "216": { runes: 370_478, increase: 4_243, total: 23_625_833 },
  "217": { runes: 374_753, increase: 4_275, total: 23_996_311 },
  "218": { runes: 379_061, increase: 4_308, total: 24_371_064 },
  "219": { runes: 383_401, increase: 4_340, total: 24_750_125 },
  "220": { runes: 387_773, increase: 4_372, total: 25_133_526 },
  "221": { runes: 392_178, increase: 4_405, total: 25_521_299 },
  "222": { runes: 396_615, increase: 4_437, total: 25_913_477 },
  "223": { runes: 401_086, increase: 4_471, total: 26_310_092 },
  "224": { runes: 405_590, increase: 4_504, total: 26_711_178 },
  "225": { runes: 410_126, increase: 4_536, total: 27_116_768 },
  "226": { runes: 414_696, increase: 4_570, total: 27_526_894 },
  "227": { runes: 419_299, increase: 4_603, total: 27_941_590 },
  "228": { runes: 423_936, increase: 4_637, total: 28_360_889 },
  "229": { runes: 428_607, increase: 4_671, total: 28_784_825 },
  "230": { runes: 433_311, increase: 4_704, total: 29_213_432 },
  "231": { runes: 438_049, increase: 4_738, total: 29_646_743 },
  "232": { runes: 442_820, increase: 4_771, total: 30_084_792 },
  "233": { runes: 447_626, increase: 4_806, total: 30_527_612 },
  "234": { runes: 452_467, increase: 4_841, total: 30_975_238 },
  "235": { runes: 457_341, increase: 4_874, total: 31_427_705 },
  "236": { runes: 462_250, increase: 4_909, total: 31_885_046 },
  "237": { runes: 467_193, increase: 4_943, total: 32_347_296 },
  "238": { runes: 472_172, increase: 4_979, total: 32_814_489 },
  "239": { runes: 477_185, increase: 5_013, total: 33_286_661 },
  "240": { runes: 482_232, increase: 5_047, total: 33_763_846 },
  "241": { runes: 487_315, increase: 5_083, total: 34_246_078 },
  "242": { runes: 492_433, increase: 5_118, total: 34_733_393 },
  "243": { runes: 497_587, increase: 5_154, total: 35_225_826 },
  "244": { runes: 502_776, increase: 5_189, total: 35_723_413 },
  "245": { runes: 508_000, increase: 5_224, total: 36_226_189 },
  "246": { runes: 513_260, increase: 5_260, total: 36_734_189 },
  "247": { runes: 518_555, increase: 5_295, total: 37_247_449 },
  "248": { runes: 523_887, increase: 5_332, total: 37_766_004 },
  "249": { runes: 529_255, increase: 5_368, total: 38_289_891 },
  "250": { runes: 534_658, increase: 5_403, total: 38_819_146 },
  "251": { runes: 540_098, increase: 5_440, total: 39_353_804 },
  "252": { runes: 545_574, increase: 5_476, total: 39_893_902 },
  "253": { runes: 551_087, increase: 5_513, total: 40_439_476 },
  "254": { runes: 556_637, increase: 5_550, total: 40_990_563 },
  "255": { runes: 562_223, increase: 5_586, total: 41_547_200 },
  "256": { runes: 567_846, increase: 5_623, total: 42_109_423 },
  "257": { runes: 573_505, increase: 5_659, total: 42_677_269 },
  "258": { runes: 579_202, increase: 5_697, total: 43_250_774 },
  "259": { runes: 584_937, increase: 5_735, total: 43_829_976 },
  "260": { runes: 590_708, increase: 5_771, total: 44_414_913 },
  "261": { runes: 596_517, increase: 5_809, total: 45_005_621 },
  "262": { runes: 602_363, increase: 5_846, total: 45_602_138 },
  "263": { runes: 608_248, increase: 5_885, total: 46_204_501 },
  "264": { runes: 614_170, increase: 5_922, total: 46_812_749 },
  "265": { runes: 620_129, increase: 5_959, total: 47_426_919 },
  "266": { runes: 626_127, increase: 5_998, total: 48_047_048 },
  "267": { runes: 632_163, increase: 6_036, total: 48_673_175 },
  "268": { runes: 638_238, increase: 6_075, total: 49_305_338 },
  "269": { runes: 644_351, increase: 6_113, total: 49_943_576 },
  "270": { runes: 650_502, increase: 6_151, total: 50_587_927 },
  "271": { runes: 656_692, increase: 6_190, total: 51_238_429 },
  "272": { runes: 662_920, increase: 6_228, total: 51_895_121 },
  "273": { runes: 669_188, increase: 6_268, total: 52_558_041 },
  "274": { runes: 675_495, increase: 6_307, total: 53_227_229 },
  "275": { runes: 681_840, increase: 6_345, total: 53_902_724 },
  "276": { runes: 688_225, increase: 6_385, total: 54_584_564 },
  "277": { runes: 694_649, increase: 6_424, total: 55_272_789 },
  "278": { runes: 701_113, increase: 6_464, total: 55_967_438 },
  "279": { runes: 707_617, increase: 6_504, total: 56_668_551 },
  "280": { runes: 714_160, increase: 6_543, total: 57_376_168 },
  "281": { runes: 720_743, increase: 6_583, total: 58_090_328 },
  "282": { runes: 727_365, increase: 6_622, total: 58_811_071 },
  "283": { runes: 734_028, increase: 6_663, total: 59_538_436 },
  "284": { runes: 740_732, increase: 6_704, total: 60_272_464 },
  "285": { runes: 747_475, increase: 6_743, total: 61_013_196 },
  "286": { runes: 754_259, increase: 6_784, total: 61_760_671 },
  "287": { runes: 761_083, increase: 6_824, total: 62_514_930 },
  "288": { runes: 767_949, increase: 6_866, total: 63_276_013 },
  "289": { runes: 774_855, increase: 6_906, total: 64_043_962 },
  "290": { runes: 781_801, increase: 6_946, total: 64_818_817 },
  "291": { runes: 788_789, increase: 6_988, total: 65_600_618 },
  "292": { runes: 795_818, increase: 7_029, total: 66_389_407 },
  "293": { runes: 802_889, increase: 7_071, total: 67_185_225 },
  "294": { runes: 810_001, increase: 7_112, total: 67_988_114 },
  "295": { runes: 817_154, increase: 7_153, total: 68_798_115 },
  "296": { runes: 824_349, increase: 7_195, total: 69_615_269 },
  "297": { runes: 831_585, increase: 7_236, total: 70_439_618 },
  "298": { runes: 838_864, increase: 7_279, total: 71_271_203 },
  "299": { runes: 846_185, increase: 7_321, total: 72_110_067 },
  "300": { runes: 853_547, increase: 7_362, total: 72_956_252 },
  "301": { runes: 860_952, increase: 7_405, total: 73_809_799 },
  "302": { runes: 868_399, increase: 7_447, total: 74_670_751 },
  "303": { runes: 875_889, increase: 7_490, total: 75_539_150 },
  "304": { runes: 883_422, increase: 7_533, total: 76_415_039 },
  "305": { runes: 890_997, increase: 7_575, total: 77_298_461 },
  "306": { runes: 898_615, increase: 7_618, total: 78_189_458 },
  "307": { runes: 906_275, increase: 7_660, total: 79_088_073 },
  "308": { runes: 913_979, increase: 7_704, total: 79_994_348 },
  "309": { runes: 921_727, increase: 7_748, total: 80_908_327 },
  "310": { runes: 929_517, increase: 7_790, total: 81_830_054 },
  "311": { runes: 937_351, increase: 7_834, total: 82_759_571 },
  "312": { runes: 945_228, increase: 7_877, total: 83_696_922 },
  "313": { runes: 953_150, increase: 7_922, total: 84_642_150 },
  "314": { runes: 961_115, increase: 7_965, total: 85_595_300 },
  "315": { runes: 969_123, increase: 8_008, total: 86_556_415 },
  "316": { runes: 977_176, increase: 8_053, total: 87_525_538 },
  "317": { runes: 985_273, increase: 8_097, total: 88_502_714 },
  "318": { runes: 993_415, increase: 8_142, total: 89_487_987 },
  "319": { runes: 1_001_601, increase: 8_186, total: 90_481_402 },
  "320": { runes: 1_009_831, increase: 8_230, total: 91_483_003 },
  "321": { runes: 1_018_106, increase: 8_275, total: 92_492_834 },
  "322": { runes: 1_026_425, increase: 8_319, total: 93_510_940 },
  "323": { runes: 1_034_790, increase: 8_365, total: 94_537_365 },
  "324": { runes: 1_043_200, increase: 8_410, total: 95_572_155 },
  "325": { runes: 1_051_654, increase: 8_454, total: 96_615_355 },
  "326": { runes: 1_060_154, increase: 8_500, total: 97_667_009 },
  "327": { runes: 1_068_699, increase: 8_545, total: 98_727_163 },
  "328": { runes: 1_077_290, increase: 8_591, total: 99_795_862 },
  "329": { runes: 1_085_927, increase: 8_637, total: 100_873_152 },
  "330": { runes: 1_094_609, increase: 8_682, total: 101_959_079 },
  "331": { runes: 1_103_337, increase: 8_728, total: 103_053_688 },
  "332": { runes: 1_112_110, increase: 8_773, total: 104_157_025 },
  "333": { runes: 1_120_930, increase: 8_820, total: 105_269_135 },
  "334": { runes: 1_129_797, increase: 8_867, total: 106_390_065 },
  "335": { runes: 1_138_709, increase: 8_912, total: 107_519_862 },
  "336": { runes: 1_147_668, increase: 8_959, total: 108_658_571 },
  "337": { runes: 1_156_673, increase: 9_005, total: 109_806_239 },
  "338": { runes: 1_165_726, increase: 9_053, total: 110_962_912 },
  "339": { runes: 1_174_825, increase: 9_099, total: 112_128_638 },
  "340": { runes: 1_183_970, increase: 9_145, total: 113_303_463 },
  "341": { runes: 1_193_163, increase: 9_193, total: 114_487_433 },
  "342": { runes: 1_202_403, increase: 9_240, total: 115_680_596 },
  "343": { runes: 1_211_691, increase: 9_288, total: 116_882_999 },
  "344": { runes: 1_221_026, increase: 9_335, total: 118_094_690 },
  "345": { runes: 1_230_408, increase: 9_382, total: 119_315_716 },
  "346": { runes: 1_239_838, increase: 9_430, total: 120_546_124 },
  "347": { runes: 1_249_315, increase: 9_477, total: 121_785_962 },
  "348": { runes: 1_258_841, increase: 9_526, total: 123_035_277 },
  "349": { runes: 1_268_415, increase: 9_574, total: 124_294_118 },
  "350": { runes: 1_278_036, increase: 9_621, total: 125_562_533 },
  "351": { runes: 1_287_706, increase: 9_670, total: 126_840_569 },
  "352": { runes: 1_297_424, increase: 9_718, total: 128_128_275 },
  "353": { runes: 1_307_191, increase: 9_767, total: 129_425_699 },
  "354": { runes: 1_317_007, increase: 9_816, total: 130_732_890 },
  "355": { runes: 1_326_871, increase: 9_864, total: 132_049_897 },
  "356": { runes: 1_336_784, increase: 9_913, total: 133_376_768 },
  "357": { runes: 1_346_745, increase: 9_961, total: 134_713_552 },
  "358": { runes: 1_356_756, increase: 10_011, total: 136_060_297 },
  "359": { runes: 1_366_817, increase: 10_061, total: 137_417_053 },
  "360": { runes: 1_376_926, increase: 10_109, total: 138_783_870 },
  "361": { runes: 1_387_085, increase: 10_159, total: 140_160_796 },
  "362": { runes: 1_397_293, increase: 10_208, total: 141_547_881 },
  "363": { runes: 1_407_552, increase: 10_259, total: 142_945_174 },
  "364": { runes: 1_417_860, increase: 10_308, total: 144_352_726 },
  "365": { runes: 1_428_217, increase: 10_357, total: 145_770_586 },
  "366": { runes: 1_438_625, increase: 10_408, total: 147_198_803 },
  "367": { runes: 1_449_083, increase: 10_458, total: 148_637_428 },
  "368": { runes: 1_459_592, increase: 10_509, total: 150_086_511 },
  "369": { runes: 1_470_151, increase: 10_559, total: 151_546_103 },
  "370": { runes: 1_480_760, increase: 10_609, total: 153_016_254 },
  "371": { runes: 1_491_420, increase: 10_660, total: 154_497_014 },
  "372": { runes: 1_502_130, increase: 10_710, total: 155_988_434 },
  "373": { runes: 1_512_892, increase: 10_762, total: 157_490_564 },
  "374": { runes: 1_523_705, increase: 10_813, total: 159_003_456 },
  "375": { runes: 1_534_568, increase: 10_863, total: 160_527_161 },
  "376": { runes: 1_545_483, increase: 10_915, total: 162_061_729 },
  "377": { runes: 1_556_449, increase: 10_966, total: 163_607_212 },
  "378": { runes: 1_567_467, increase: 11_018, total: 165_163_661 },
  "379": { runes: 1_578_537, increase: 11_070, total: 166_731_128 },
  "380": { runes: 1_589_658, increase: 11_121, total: 168_309_665 },
  "381": { runes: 1_600_831, increase: 11_173, total: 169_899_323 },
  "382": { runes: 1_612_055, increase: 11_224, total: 171_500_154 },
  "383": { runes: 1_623_332, increase: 11_277, total: 173_112_209 },
  "384": { runes: 1_634_662, increase: 11_330, total: 174_735_541 },
  "385": { runes: 1_646_043, increase: 11_381, total: 176_370_203 },
  "386": { runes: 1_657_477, increase: 11_434, total: 178_016_246 },
  "387": { runes: 1_668_963, increase: 11_486, total: 179_673_723 },
  "388": { runes: 1_680_503, increase: 11_540, total: 181_342_686 },
  "389": { runes: 1_692_095, increase: 11_592, total: 183_023_189 },
  "390": { runes: 1_703_739, increase: 11_644, total: 184_715_284 },
  "391": { runes: 1_715_437, increase: 11_698, total: 186_419_023 },
  "392": { runes: 1_727_188, increase: 11_751, total: 188_134_460 },
  "393": { runes: 1_738_993, increase: 11_805, total: 189_861_648 },
  "394": { runes: 1_750_851, increase: 11_858, total: 191_600_641 },
  "395": { runes: 1_762_762, increase: 11_911, total: 193_351_492 },
  "396": { runes: 1_774_727, increase: 11_965, total: 195_114_254 },
  "397": { runes: 1_786_745, increase: 12_018, total: 196_888_981 },
  "398": { runes: 1_798_818, increase: 12_073, total: 198_675_726 },
  "399": { runes: 1_810_945, increase: 12_127, total: 200_474_544 },
  "400": { runes: 1_823_125, increase: 12_180, total: 202_285_489 },
  "401": { runes: 1_835_360, increase: 12_235, total: 204_108_614 },
  "402": { runes: 1_847_649, increase: 12_289, total: 205_943_974 },
  "403": { runes: 1_859_993, increase: 12_344, total: 207_791_623 },
  "404": { runes: 1_872_392, increase: 12_399, total: 209_651_616 },
  "405": { runes: 1_884_845, increase: 12_453, total: 211_524_008 },
  "406": { runes: 1_897_353, increase: 12_508, total: 213_408_853 },
  "407": { runes: 1_909_915, increase: 12_562, total: 215_306_206 },
  "408": { runes: 1_922_533, increase: 12_618, total: 217_216_121 },
  "409": { runes: 1_935_207, increase: 12_674, total: 219_138_654 },
  "410": { runes: 1_947_935, increase: 12_728, total: 221_073_861 },
  "411": { runes: 1_960_719, increase: 12_784, total: 223_021_796 },
  "412": { runes: 1_973_558, increase: 12_839, total: 224_982_515 },
  "413": { runes: 1_986_454, increase: 12_896, total: 226_956_073 },
  "414": { runes: 1_999_405, increase: 12_951, total: 228_942_527 },
  "415": { runes: 2_012_411, increase: 13_006, total: 230_941_932 },
  "416": { runes: 2_025_474, increase: 13_063, total: 232_954_343 },
  "417": { runes: 2_038_593, increase: 13_119, total: 234_979_817 },
  "418": { runes: 2_051_769, increase: 13_176, total: 237_018_410 },
  "419": { runes: 2_065_001, increase: 13_232, total: 239_070_179 },
  "420": { runes: 2_078_289, increase: 13_288, total: 241_135_180 },
  "421": { runes: 2_091_634, increase: 13_345, total: 243_213_469 },
  "422": { runes: 2_105_035, increase: 13_401, total: 245_305_103 },
  "423": { runes: 2_118_494, increase: 13_459, total: 247_410_138 },
  "424": { runes: 2_132_010, increase: 13_516, total: 249_528_632 },
  "425": { runes: 2_145_582, increase: 13_572, total: 251_660_642 },
  "426": { runes: 2_159_212, increase: 13_630, total: 253_806_224 },
  "427": { runes: 2_172_899, increase: 13_687, total: 255_965_436 },
  "428": { runes: 2_186_644, increase: 13_745, total: 258_138_335 },
  "429": { runes: 2_200_447, increase: 13_803, total: 260_324_979 },
  "430": { runes: 2_214_307, increase: 13_860, total: 262_525_426 },
  "431": { runes: 2_228_225, increase: 13_918, total: 264_739_733 },
  "432": { runes: 2_242_200, increase: 13_975, total: 266_967_958 },
  "433": { runes: 2_256_234, increase: 14_034, total: 269_210_158 },
  "434": { runes: 2_270_327, increase: 14_093, total: 271_466_392 },
  "435": { runes: 2_284_477, increase: 14_150, total: 273_736_719 },
  "436": { runes: 2_298_686, increase: 14_209, total: 276_021_196 },
  "437": { runes: 2_312_953, increase: 14_267, total: 278_319_882 },
  "438": { runes: 2_327_280, increase: 14_327, total: 280_632_835 },
  "439": { runes: 2_341_665, increase: 14_385, total: 282_960_115 },
  "440": { runes: 2_356_108, increase: 14_443, total: 285_301_780 },
  "441": { runes: 2_370_611, increase: 14_503, total: 287_657_888 },
  "442": { runes: 2_385_173, increase: 14_562, total: 290_028_499 },
  "443": { runes: 2_399_795, increase: 14_622, total: 292_413_672 },
  "444": { runes: 2_414_476, increase: 14_681, total: 294_813_467 },
  "445": { runes: 2_429_216, increase: 14_740, total: 297_227_943 },
  "446": { runes: 2_444_016, increase: 14_800, total: 299_657_159 },
  "447": { runes: 2_458_875, increase: 14_859, total: 302_101_175 },
  "448": { runes: 2_473_795, increase: 14_920, total: 304_560_050 },
  "449": { runes: 2_488_775, increase: 14_980, total: 307_033_845 },
  "450": { runes: 2_503_814, increase: 15_039, total: 309_522_620 },
  "451": { runes: 2_518_914, increase: 15_100, total: 312_026_434 },
  "452": { runes: 2_534_074, increase: 15_160, total: 314_545_348 },
  "453": { runes: 2_549_295, increase: 15_221, total: 317_079_422 },
  "454": { runes: 2_564_577, increase: 15_282, total: 319_628_717 },
  "455": { runes: 2_579_919, increase: 15_342, total: 322_193_294 },
  "456": { runes: 2_595_322, increase: 15_403, total: 324_773_213 },
  "457": { runes: 2_610_785, increase: 15_463, total: 327_368_535 },
  "458": { runes: 2_626_310, increase: 15_525, total: 329_979_320 },
  "459": { runes: 2_641_897, increase: 15_587, total: 332_605_630 },
  "460": { runes: 2_657_544, increase: 15_647, total: 335_247_527 },
  "461": { runes: 2_673_253, increase: 15_709, total: 337_905_071 },
  "462": { runes: 2_689_023, increase: 15_770, total: 340_578_324 },
  "463": { runes: 2_704_856, increase: 15_833, total: 343_267_347 },
  "464": { runes: 2_720_750, increase: 15_894, total: 345_972_203 },
  "465": { runes: 2_736_705, increase: 15_955, total: 348_692_953 },
  "466": { runes: 2_752_723, increase: 16_018, total: 351_429_658 },
  "467": { runes: 2_768_803, increase: 16_080, total: 354_182_381 },
  "468": { runes: 2_784_946, increase: 16_143, total: 356_951_184 },
  "469": { runes: 2_801_151, increase: 16_205, total: 359_736_130 },
  "470": { runes: 2_817_418, increase: 16_267, total: 362_537_281 },
  "471": { runes: 2_833_748, increase: 16_330, total: 365_354_699 },
  "472": { runes: 2_850_140, increase: 16_392, total: 368_188_447 },
  "473": { runes: 2_866_596, increase: 16_456, total: 371_038_587 },
  "474": { runes: 2_883_115, increase: 16_519, total: 373_905_183 },
  "475": { runes: 2_899_696, increase: 16_581, total: 376_788_298 },
  "476": { runes: 2_916_341, increase: 16_645, total: 379_687_994 },
  "477": { runes: 2_933_049, increase: 16_708, total: 382_604_335 },
  "478": { runes: 2_949_821, increase: 16_772, total: 385_537_384 },
  "479": { runes: 2_966_657, increase: 16_836, total: 388_487_205 },
  "480": { runes: 2_983_556, increase: 16_899, total: 391_453_862 },
  "481": { runes: 3_000_519, increase: 16_963, total: 394_437_418 },
  "482": { runes: 3_017_545, increase: 17_026, total: 397_437_937 },
  "483": { runes: 3_034_636, increase: 17_091, total: 400_455_482 },
  "484": { runes: 3_051_792, increase: 17_156, total: 403_490_118 },
  "485": { runes: 3_069_011, increase: 17_219, total: 406_541_910 },
  "486": { runes: 3_086_295, increase: 17_284, total: 409_610_921 },
  "487": { runes: 3_103_643, increase: 17_348, total: 412_697_216 },
  "488": { runes: 3_121_057, increase: 17_414, total: 415_800_859 },
  "489": { runes: 3_138_535, increase: 17_478, total: 418_921_916 },
  "490": { runes: 3_156_077, increase: 17_542, total: 422_060_451 },
  "491": { runes: 3_173_685, increase: 17_608, total: 425_216_528 },
  "492": { runes: 3_191_358, increase: 17_673, total: 428_390_213 },
  "493": { runes: 3_209_097, increase: 17_739, total: 431_581_571 },
  "494": { runes: 3_226_901, increase: 17_804, total: 434_790_668 },
  "495": { runes: 3_244_770, increase: 17_869, total: 438_017_569 },
  "496": { runes: 3_262_705, increase: 17_935, total: 441_262_339 },
  "497": { runes: 3_280_705, increase: 18_000, total: 444_525_044 },
  "498": { runes: 3_298_772, increase: 18_067, total: 447_805_749 },
  "499": { runes: 3_316_905, increase: 18_133, total: 451_104_521 },
  "500": { runes: 3_335_103, increase: 18_198, total: 454_421_426 },
  "501": { runes: 3_353_368, increase: 18_265, total: 457_756_529 },
  "502": { runes: 3_371_699, increase: 18_331, total: 461_109_897 },
  "503": { runes: 3_390_097, increase: 18_398, total: 464_481_596 },
  "504": { runes: 3_408_562, increase: 18_465, total: 467_871_693 },
  "505": { runes: 3_427_093, increase: 18_531, total: 471_280_255 },
  "506": { runes: 3_445_691, increase: 18_598, total: 474_707_348 },
  "507": { runes: 3_464_355, increase: 18_664, total: 478_153_039 },
  "508": { runes: 3_483_087, increase: 18_732, total: 481_617_394 },
  "509": { runes: 3_501_887, increase: 18_800, total: 485_100_481 },
  "510": { runes: 3_520_753, increase: 18_866, total: 488_602_368 },
  "511": { runes: 3_539_687, increase: 18_934, total: 492_123_121 },
  "512": { runes: 3_558_688, increase: 19_001, total: 495_662_808 },
  "513": { runes: 3_577_758, increase: 19_070, total: 499_221_496 },
  "514": { runes: 3_596_895, increase: 19_137, total: 502_799_254 },
  "515": { runes: 3_616_099, increase: 19_204, total: 506_396_149 },
  "516": { runes: 3_635_372, increase: 19_273, total: 510_012_248 },
  "517": { runes: 3_654_713, increase: 19_341, total: 513_647_620 },
  "518": { runes: 3_674_123, increase: 19_410, total: 517_302_333 },
  "519": { runes: 3_693_601, increase: 19_478, total: 520_976_456 },
  "520": { runes: 3_713_147, increase: 19_546, total: 524_670_057 },
  "521": { runes: 3_732_762, increase: 19_615, total: 528_383_204 },
  "522": { runes: 3_752_445, increase: 19_683, total: 532_115_966 },
  "523": { runes: 3_772_198, increase: 19_753, total: 535_868_411 },
  "524": { runes: 3_792_020, increase: 19_822, total: 539_640_609 },
  "525": { runes: 3_811_910, increase: 19_890, total: 543_432_629 },
  "526": { runes: 3_831_870, increase: 19_960, total: 547_244_539 },
  "527": { runes: 3_851_899, increase: 20_029, total: 551_076_409 },
  "528": { runes: 3_871_998, increase: 20_099, total: 554_928_308 },
  "529": { runes: 3_892_167, increase: 20_169, total: 558_800_306 },
  "530": { runes: 3_912_405, increase: 20_238, total: 562_692_473 },
  "531": { runes: 3_932_713, increase: 20_308, total: 566_604_878 },
  "532": { runes: 3_953_090, increase: 20_377, total: 570_537_591 },
  "533": { runes: 3_973_538, increase: 20_448, total: 574_490_681 },
  "534": { runes: 3_994_057, increase: 20_519, total: 578_464_219 },
  "535": { runes: 4_014_645, increase: 20_588, total: 582_458_276 },
  "536": { runes: 4_035_304, increase: 20_659, total: 586_472_921 },
  "537": { runes: 4_056_033, increase: 20_729, total: 590_508_225 },
  "538": { runes: 4_076_834, increase: 20_801, total: 594_564_258 },
  "539": { runes: 4_097_705, increase: 20_871, total: 598_641_092 },
  "540": { runes: 4_118_646, increase: 20_941, total: 602_738_797 },
  "541": { runes: 4_139_659, increase: 21_013, total: 606_857_443 },
  "542": { runes: 4_160_743, increase: 21_084, total: 610_997_102 },
  "543": { runes: 4_181_899, increase: 21_156, total: 615_157_845 },
  "544": { runes: 4_203_126, increase: 21_227, total: 619_339_744 },
  "545": { runes: 4_224_424, increase: 21_298, total: 623_542_870 },
  "546": { runes: 4_245_794, increase: 21_370, total: 627_767_294 },
  "547": { runes: 4_267_235, increase: 21_441, total: 632_013_088 },
  "548": { runes: 4_288_749, increase: 21_514, total: 636_280_323 },
  "549": { runes: 4_310_335, increase: 21_586, total: 640_569_072 },
  "550": { runes: 4_331_992, increase: 21_657, total: 644_879_407 },
  "551": { runes: 4_353_722, increase: 21_730, total: 649_211_399 },
  "552": { runes: 4_375_524, increase: 21_802, total: 653_565_121 },
  "553": { runes: 4_397_399, increase: 21_875, total: 657_940_645 },
  "554": { runes: 4_419_347, increase: 21_948, total: 662_338_044 },
  "555": { runes: 4_441_367, increase: 22_020, total: 666_757_391 },
  "556": { runes: 4_463_460, increase: 22_093, total: 671_198_758 },
  "557": { runes: 4_485_625, increase: 22_165, total: 675_662_218 },
  "558": { runes: 4_507_864, increase: 22_239, total: 680_147_843 },
  "559": { runes: 4_530_177, increase: 22_313, total: 684_655_707 },
  "560": { runes: 4_552_562, increase: 22_385, total: 689_185_884 },
  "561": { runes: 4_575_021, increase: 22_459, total: 693_738_446 },
  "562": { runes: 4_597_553, increase: 22_532, total: 698_313_467 },
  "563": { runes: 4_620_160, increase: 22_607, total: 702_911_020 },
  "564": { runes: 4_642_840, increase: 22_680, total: 707_531_180 },
  "565": { runes: 4_665_593, increase: 22_753, total: 712_174_020 },
  "566": { runes: 4_688_421, increase: 22_828, total: 716_839_613 },
  "567": { runes: 4_711_323, increase: 22_902, total: 721_528_034 },
  "568": { runes: 4_734_300, increase: 22_977, total: 726_239_357 },
  "569": { runes: 4_757_351, increase: 23_051, total: 730_973_657 },
  "570": { runes: 4_780_476, increase: 23_125, total: 735_731_008 },
  "571": { runes: 4_803_676, increase: 23_200, total: 740_511_484 },
  "572": { runes: 4_826_950, increase: 23_274, total: 745_315_160 },
  "573": { runes: 4_850_300, increase: 23_350, total: 750_142_110 },
  "574": { runes: 4_873_725, increase: 23_425, total: 754_992_410 },
  "575": { runes: 4_897_224, increase: 23_499, total: 759_866_135 },
  "576": { runes: 4_920_799, increase: 23_575, total: 764_763_359 },
  "577": { runes: 4_944_449, increase: 23_650, total: 769_684_158 },
  "578": { runes: 4_968_175, increase: 23_726, total: 774_628_607 },
  "579": { runes: 4_991_977, increase: 23_802, total: 779_596_782 },
  "580": { runes: 5_015_854, increase: 23_877, total: 784_588_759 },
  "581": { runes: 5_039_807, increase: 23_953, total: 789_604_613 },
  "582": { runes: 5_063_835, increase: 24_028, total: 794_644_420 },
  "583": { runes: 5_087_940, increase: 24_105, total: 799_708_255 },
  "584": { runes: 5_112_122, increase: 24_182, total: 804_796_195 },
  "585": { runes: 5_136_379, increase: 24_257, total: 809_908_317 },
  "586": { runes: 5_160_713, increase: 24_334, total: 815_044_696 },
  "587": { runes: 5_185_123, increase: 24_410, total: 820_205_409 },
  "588": { runes: 5_209_611, increase: 24_488, total: 825_390_532 },
  "589": { runes: 5_234_175, increase: 24_564, total: 830_600_143 },
  "590": { runes: 5_258_815, increase: 24_640, total: 835_834_318 },
  "591": { runes: 5_283_533, increase: 24_718, total: 841_093_133 },
  "592": { runes: 5_308_328, increase: 24_795, total: 846_376_666 },
  "593": { runes: 5_333_201, increase: 24_873, total: 851_684_994 },
  "594": { runes: 5_358_151, increase: 24_950, total: 857_018_195 },
  "595": { runes: 5_383_178, increase: 25_027, total: 862_376_346 },
  "596": { runes: 5_408_283, increase: 25_105, total: 867_759_524 },
  "597": { runes: 5_433_465, increase: 25_182, total: 873_167_807 },
  "598": { runes: 5_458_726, increase: 25_261, total: 878_601_272 },
  "599": { runes: 5_484_065, increase: 25_339, total: 884_059_998 },
  "600": { runes: 5_509_481, increase: 25_416, total: 889_544_063 },
  "601": { runes: 5_534_976, increase: 25_495, total: 895_053_544 },
  "602": { runes: 5_560_549, increase: 25_573, total: 900_588_520 },
  "603": { runes: 5_586_201, increase: 25_652, total: 906_149_069 },
  "604": { runes: 5_611_932, increase: 25_731, total: 911_735_270 },
  "605": { runes: 5_637_741, increase: 25_809, total: 917_347_202 },
  "606": { runes: 5_663_629, increase: 25_888, total: 922_984_943 },
  "607": { runes: 5_689_595, increase: 25_966, total: 928_648_572 },
  "608": { runes: 5_715_641, increase: 26_046, total: 934_338_167 },
  "609": { runes: 5_741_767, increase: 26_126, total: 940_053_808 },
  "610": { runes: 5_767_971, increase: 26_204, total: 945_795_575 },
  "611": { runes: 5_794_255, increase: 26_284, total: 951_563_546 },
  "612": { runes: 5_820_618, increase: 26_363, total: 957_357_801 },
  "613": { runes: 5_847_062, increase: 26_444, total: 963_178_419 },
  "614": { runes: 5_873_585, increase: 26_523, total: 969_025_481 },
  "615": { runes: 5_900_187, increase: 26_602, total: 974_899_066 },
  "616": { runes: 5_926_870, increase: 26_683, total: 980_799_253 },
  "617": { runes: 5_953_633, increase: 26_763, total: 986_726_123 },
  "618": { runes: 5_980_477, increase: 26_844, total: 992_679_756 },
  "619": { runes: 6_007_401, increase: 26_924, total: 998_660_233 },
  "620": { runes: 6_034_405, increase: 27_004, total: 1_004_667_634 },
  "621": { runes: 6_061_490, increase: 27_085, total: 1_010_702_039 },
  "622": { runes: 6_088_655, increase: 27_165, total: 1_016_763_529 },
  "623": { runes: 6_115_902, increase: 27_247, total: 1_022_852_184 },
  "624": { runes: 6_143_230, increase: 27_328, total: 1_028_968_086 },
  "625": { runes: 6_170_638, increase: 27_408, total: 1_035_111_316 },
  "626": { runes: 6_198_128, increase: 27_490, total: 1_041_281_954 },
  "627": { runes: 6_225_699, increase: 27_571, total: 1_047_480_082 },
  "628": { runes: 6_253_352, increase: 27_653, total: 1_053_705_781 },
  "629": { runes: 6_281_087, increase: 27_735, total: 1_059_959_133 },
  "630": { runes: 6_308_903, increase: 27_816, total: 1_066_240_220 },
  "631": { runes: 6_336_801, increase: 27_898, total: 1_072_549_123 },
  "632": { runes: 6_364_780, increase: 27_979, total: 1_078_885_924 },
  "633": { runes: 6_392_842, increase: 28_062, total: 1_085_250_704 },
  "634": { runes: 6_420_987, increase: 28_145, total: 1_091_643_546 },
  "635": { runes: 6_449_213, increase: 28_226, total: 1_098_064_533 },
  "636": { runes: 6_477_522, increase: 28_309, total: 1_104_513_746 },
  "637": { runes: 6_505_913, increase: 28_391, total: 1_110_991_268 },
  "638": { runes: 6_534_388, increase: 28_475, total: 1_117_497_181 },
  "639": { runes: 6_562_945, increase: 28_557, total: 1_124_031_569 },
  "640": { runes: 6_591_584, increase: 28_639, total: 1_130_594_514 },
  "641": { runes: 6_620_307, increase: 28_723, total: 1_137_186_098 },
  "642": { runes: 6_649_113, increase: 28_806, total: 1_143_806_405 },
  "643": { runes: 6_678_003, increase: 28_890, total: 1_150_455_518 },
  "644": { runes: 6_706_976, increase: 28_973, total: 1_157_133_521 },
  "645": { runes: 6_736_032, increase: 29_056, total: 1_163_840_497 },
  "646": { runes: 6_765_172, increase: 29_140, total: 1_170_576_529 },
  "647": { runes: 6_794_395, increase: 29_223, total: 1_177_341_701 },
  "648": { runes: 6_823_703, increase: 29_308, total: 1_184_136_096 },
  "649": { runes: 6_853_095, increase: 29_392, total: 1_190_959_799 },
  "650": { runes: 6_882_570, increase: 29_475, total: 1_197_812_894 },
  "651": { runes: 6_912_130, increase: 29_560, total: 1_204_695_464 },
  "652": { runes: 6_941_774, increase: 29_644, total: 1_211_607_594 },
  "653": { runes: 6_971_503, increase: 29_729, total: 1_218_549_368 },
  "654": { runes: 7_001_317, increase: 29_814, total: 1_225_520_871 },
  "655": { runes: 7_031_215, increase: 29_898, total: 1_232_522_188 },
  "656": { runes: 7_061_198, increase: 29_983, total: 1_239_553_403 },
  "657": { runes: 7_091_265, increase: 30_067, total: 1_246_614_601 },
  "658": { runes: 7_121_418, increase: 30_153, total: 1_253_705_866 },
  "659": { runes: 7_151_657, increase: 30_239, total: 1_260_827_284 },
  "660": { runes: 7_181_980, increase: 30_323, total: 1_267_978_941 },
  "661": { runes: 7_212_389, increase: 30_409, total: 1_275_160_921 },
  "662": { runes: 7_242_883, increase: 30_494, total: 1_282_373_310 },
  "663": { runes: 7_273_464, increase: 30_581, total: 1_289_616_193 },
  "664": { runes: 7_304_130, increase: 30_666, total: 1_296_889_657 },
  "665": { runes: 7_334_881, increase: 30_751, total: 1_304_193_787 },
  "666": { runes: 7_365_719, increase: 30_838, total: 1_311_528_668 },
  "667": { runes: 7_396_643, increase: 30_924, total: 1_318_894_387 },
  "668": { runes: 7_427_654, increase: 31_011, total: 1_326_291_030 },
  "669": { runes: 7_458_751, increase: 31_097, total: 1_333_718_684 },
  "670": { runes: 7_489_934, increase: 31_183, total: 1_341_177_435 },
  "671": { runes: 7_521_204, increase: 31_270, total: 1_348_667_369 },
  "672": { runes: 7_552_560, increase: 31_356, total: 1_356_188_573 },
  "673": { runes: 7_584_004, increase: 31_444, total: 1_363_741_133 },
  "674": { runes: 7_615_535, increase: 31_531, total: 1_371_325_137 },
  "675": { runes: 7_647_152, increase: 31_617, total: 1_378_940_672 },
  "676": { runes: 7_678_857, increase: 31_705, total: 1_386_587_824 },
  "677": { runes: 7_710_649, increase: 31_792, total: 1_394_266_681 },
  "678": { runes: 7_742_529, increase: 31_880, total: 1_401_977_330 },
  "679": { runes: 7_774_497, increase: 31_968, total: 1_409_719_859 },
  "680": { runes: 7_806_552, increase: 32_055, total: 1_417_494_356 },
  "681": { runes: 7_838_695, increase: 32_143, total: 1_425_300_908 },
  "682": { runes: 7_870_925, increase: 32_230, total: 1_433_139_603 },
  "683": { runes: 7_903_244, increase: 32_319, total: 1_441_010_528 },
  "684": { runes: 7_935_652, increase: 32_408, total: 1_448_913_772 },
  "685": { runes: 7_968_147, increase: 32_495, total: 1_456_849_424 },
  "686": { runes: 8_000_731, increase: 32_584, total: 1_464_817_571 },
  "687": { runes: 8_033_403, increase: 32_672, total: 1_472_818_302 },
  "688": { runes: 8_066_165, increase: 32_762, total: 1_480_851_705 },
  "689": { runes: 8_099_015, increase: 32_850, total: 1_488_917_870 },
  "690": { runes: 8_131_953, increase: 32_938, total: 1_497_016_885 },
  "691": { runes: 8_164_981, increase: 33_028, total: 1_505_148_838 },
  "692": { runes: 8_198_098, increase: 33_117, total: 1_513_313_819 },
  "693": { runes: 8_231_305, increase: 33_207, total: 1_521_511_917 },
  "694": { runes: 8_264_601, increase: 33_296, total: 1_529_743_222 },
  "695": { runes: 8_297_986, increase: 33_385, total: 1_538_007_823 },
  "696": { runes: 8_331_461, increase: 33_475, total: 1_546_305_809 },
  "697": { runes: 8_365_025, increase: 33_564, total: 1_554_637_270 },
  "698": { runes: 8_398_680, increase: 33_655, total: 1_563_002_295 },
  "699": { runes: 8_432_425, increase: 33_745, total: 1_571_400_975 },
  "700": { runes: 8_466_259, increase: 33_834, total: 1_579_833_400 },
  "701": { runes: 8_500_184, increase: 33_925, total: 1_588_299_659 },
  "702": { runes: 8_534_199, increase: 34_015, total: 1_596_799_843 },
  "703": { runes: 8_568_305, increase: 34_106, total: 1_605_334_042 },
  "704": { runes: 8_602_502, increase: 34_197, total: 1_613_902_347 },
  "705": { runes: 8_636_789, increase: 34_287, total: 1_622_504_849 },
  "706": { runes: 8_671_167, increase: 34_378, total: 1_631_141_638 },
  "707": { runes: 8_705_635, increase: 34_468, total: 1_639_812_805 },
  "708": { runes: 8_740_195, increase: 34_560, total: 1_648_518_440 },
  "709": { runes: 8_774_847, increase: 34_652, total: 1_657_258_635 },
  "710": { runes: 8_809_589, increase: 34_742, total: 1_666_033_482 },
  "711": { runes: 8_844_423, increase: 34_834, total: 1_674_843_071 },
  "712": { runes: 8_879_348, increase: 34_925, total: 1_683_687_494 },
  "713": { runes: 0, increase: 0, total: 1_692_566_842 },
};
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
