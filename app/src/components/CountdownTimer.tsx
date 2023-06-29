import { Timer } from '../services/modeApi';
import { useEffect, useState } from 'react';

const CountdownTimer = ({
  time_limit_in_seconds,
}: {
  time_limit_in_seconds: number;
}) => {
  const minutes = Math.floor(time_limit_in_seconds / 60);
  const seconds = time_limit_in_seconds % 60;

  const [time, setTime] = useState<Timer>({ minutes, seconds });

  const tick = () => {
    if (time.minutes === 0 && time.seconds === 0) {
      reset();
    } else if (time.seconds === 0) {
      setTime({ minutes: time.minutes - 1, seconds: 59 });
    } else {
      setTime({
        minutes: time.minutes,
        seconds: time.seconds - 1,
      });
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  const reset = () => {
    setTime({ minutes: time.minutes, seconds: time.seconds });
  };

  return (
    <div>
      <p className="font-bold text-white">{`${time.minutes
        .toString()
        .padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}</p>
    </div>
  );
};

export default CountdownTimer;
