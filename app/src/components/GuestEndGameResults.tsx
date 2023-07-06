export type GuestEndGameResultsProps = {
  score: number;
};

const GuestEndGameResults = ({ score }: GuestEndGameResultsProps) => {
  return (
    <div>
      <h2>You Died.</h2>
      <h1>Final Score</h1>
      <h1>{score}</h1>
    </div>
  );
};

export default GuestEndGameResults;
