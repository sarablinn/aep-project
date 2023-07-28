import { useState } from 'react';
import { selectedUser } from '../../services/Atoms';
import { useAtom } from 'jotai';
import { LightenColor } from '../../services/colorChanger';
import CrossColMatch from '../../assets/CrossColMatch.png';
import NonAdjacentRowMatch from '../../assets/NonAdjacentRowMatch.png';
import ScoreTimer from '../../assets/ScoreTimer.png';
import CompletedRow from '../../assets/CompletedRow.png';

export type GameDemoProps = {
  showPopup: boolean;
};

const GameDemo = ({ showPopup }: GameDemoProps) => {
  const [currentUser] = useAtom(selectedUser);
  const [showModal] = useState(showPopup);

  const lighten_bg_5 = LightenColor(currentUser.backgroundColor, 5);
  const [bgLighter_5] = useState(lighten_bg_5);

  return (
    <>
      {showModal ? (
        <div>
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden text-center outline-none focus:outline-none">
              <div
                className="relative mx-auto my-6 w-auto max-w-3xl"
                style={{
                  minWidth: 'max-content',
                  maxWidth: '75vw',
                  top: '10%',
                  left: '0',
                  bottom: '10%',
                  width: '100%',
                  height: '100%',
                }}
              >
                {/*content*/}
                <div
                  className="relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none"
                  style={{ backgroundColor: bgLighter_5 }}
                >
                  {/*header*/}
                  <h2 className="font-xl mb-1 bg-pink-500 px-6 py-3 text-center font-bold uppercase text-white">
                    How to Play
                  </h2>
                  <div className="flex flex-col justify-center">
                    <div className="m-3 p-3">
                      <div
                        className="m-3"
                        style={{ color: currentUser.foregroundColor }}
                      >
                        <h2
                          className="my-2 uppercase"
                          style={{ fontWeight: 'bolder', fontSize: '2rem' }}
                        >
                          Match Numbers
                        </h2>
                        <p className="text-2xl">Match the same values.</p>
                        <p className="text-2xl">
                          Or match values that equal the sum of 10.
                        </p>
                        <img
                          src={CrossColMatch}
                          className="my-2"
                          style={{
                            maxHeight: '10rem',
                            maxWidth: 'fit-content',
                            margin: 'auto',
                          }}
                        />
                        <p className="text-2xl">
                          Matches may be directly adjacent, horizontally or
                          vertically, or indirectly adjacent across previous
                          matches.
                        </p>
                        <p className="text-2xl">
                          Matches can also be made at the end or start of two
                          rows.
                        </p>
                        <img
                          src={NonAdjacentRowMatch}
                          className="my-2"
                          style={{
                            maxHeight: '10rem',
                            maxWidth: 'fit-content',
                            margin: 'auto',
                          }}
                        />
                      </div>

                      <div
                        className="m-3"
                        style={{ color: currentUser.foregroundColor }}
                      >
                        <h2
                          className="my-2 uppercase"
                          style={{ fontWeight: 'bolder', fontSize: '2rem' }}
                        >
                          No More Matches?
                        </h2>
                        <p className="text-2xl">
                          Click the 'add row' button under the timer to add
                          another row.
                        </p>
                        <img
                          src={ScoreTimer}
                          className="my-2"
                          style={{
                            maxHeight: '10rem',
                            maxWidth: 'fit-content',
                            margin: 'auto',
                          }}
                        />
                      </div>

                      <div
                        className="m-3"
                        style={{ color: currentUser.foregroundColor }}
                      >
                        <h2
                          className="my-2 uppercase"
                          style={{ fontWeight: 'bolder', fontSize: '2rem' }}
                        >
                          Score & Time
                        </h2>
                        <p className="text-2xl">Play fast!</p>
                        <p className="text-2xl">
                          You have until the timer runs out to make as many
                          matches as you can.
                        </p>
                        <p className="text-2xl">Try to complete whole rows:</p>
                        <p className="text-2xl">
                          Completed rows earn additional points worth the length
                          of the row.
                        </p>
                        <img
                          src={CompletedRow}
                          className="my-2"
                          style={{
                            maxHeight: '10rem',
                            maxWidth: 'fit-content',
                            margin: 'auto',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="z-49 fixed inset-0 bg-black opacity-50"></div>
          </>
        </div>
      ) : null}
    </>
  );
};

export default GameDemo;
