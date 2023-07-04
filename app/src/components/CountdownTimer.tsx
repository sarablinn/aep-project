import { Timer } from '../services/modeApi';
import { useEffect, useState } from 'react';

export type CountdownTimerProps = {
  time_limit_in_seconds: number;
  start_time: Date;
};

const CountdownTimer = ({
  time_limit_in_seconds,
  start_time,
}: CountdownTimerProps) => {
  // timer display values
  const starting_time = start_time.getTime();
  const starting_minutes = Math.floor(time_limit_in_seconds / 60);
  const starting_seconds = time_limit_in_seconds % 60;
  const time_limit_in_ms = time_limit_in_seconds * 1000;
  // const starting_milliseconds = 0;

  const [time, setTime] = useState<Timer>({
    minutes: starting_minutes,
    seconds: starting_seconds,
    // milliseconds: starting_milliseconds,
  });

  function msToTime(duration: number) {
    // const milliseconds = Math.floor((duration % 1000) / 100);
    let seconds: number | string = Math.floor((duration / 1000) % 60);
    let minutes: number | string = Math.floor((duration / (1000 * 60)) % 60);
    // hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // hours = (hours < 10) ? "0" + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
  }

  const tick = (duration: number) => {
    const seconds_spent: number | string = Math.floor((duration / 1000) % 60);
    const minutes_spent: number | string =
      starting_minutes - Math.floor((duration / (1000 * 60)) % 60);

    if (minutes_spent === 0 && seconds_spent === 0) {
      reset();
    } else if (minutes_spent > 0 && seconds_spent === 0) {
      setTime({
        minutes: starting_minutes - minutes_spent,
        seconds: 59,
      });
    } else if (minutes_spent === 0) {
      setTime({
        minutes: starting_minutes - minutes_spent,
        seconds: starting_seconds - seconds_spent,
      });
    }
  };

  useEffect(() => {
    const current_time = new Date().getTime();
    console.log(current_time);
    console.log('start_time: ' + starting_time);
    const time_difference = current_time - starting_time;
    console.log('msToTime: ' + msToTime(time_difference));

    const timerId = setInterval(() => tick(time_difference), 250);
    return () => clearInterval(timerId);
  });

  const reset = () => {
    setTime({
      minutes: starting_minutes,
      seconds: starting_seconds,
    });
  };

  return (
    <div>
      <p className="font-bold text-white">{`${time.minutes
        .toString()
        .padStart(2, '0')}
        :${time.seconds.toString().padStart(2, '0')}`}</p>
    </div>
  );
};

export default CountdownTimer;
