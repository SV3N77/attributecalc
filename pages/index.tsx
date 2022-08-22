import type { NextPage } from "next";
import PlayerCard from "../components/PlayerCard";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      <PlayerCard />
    </div>
  );
};

export default Home;
