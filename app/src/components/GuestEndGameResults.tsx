export type GuestEndGameResultsProps = {
  score: number;
};

const GuestEndGameResults = ({ score }: GuestEndGameResultsProps) => {
  return (
    <div className="container flex flex-col items-center p-10">
      <h2 className="p-5 font-bold text-white">You Died.</h2>
      <h1 className="font-bold text-white">Final Score</h1>
      <h1 className="font-bold text-white">{score}</h1>
    </div>
  );
};

export default GuestEndGameResults;
