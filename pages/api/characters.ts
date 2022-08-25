// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export type PlayerCards = {
  class: string;
  level: number;
  playerStats: {
    vigor: number;
    mind: number;
    endurance: number;
    strength: number;
    dexterity: number;
    intelligence: number;
    faith: number;
    arcane: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlayerCards>
) {
  const jsonDirectory = path.join(process.cwd(), "json");
  const jsonFiles = await fs.readFileSync(
    jsonDirectory + "/characters.json",
    "utf8"
  );
  const data = JSON.parse(jsonFiles);

  res.status(200).json(data);
}
