import { ModeResource } from '../services/modeApi';
import EventModeLeadershipBoard from './EventModeLeadershipBoard';
import { EventResource } from '../services/eventApi';

export type EventLeadershipBoardProps = {
  eventResource: EventResource;
  modeResources: ModeResource[];
};

const EventLeadershipBoard = ({
  eventResource,
  modeResources,
}: EventLeadershipBoardProps) => {
  if (eventResource && modeResources) {
    console.log('EventLeadershipBoard: ', eventResource, modeResources);
    return (
      <div>
        {modeResources.map(modeResource => {
          return (
            <div key={modeResource.modeName}>
              <EventModeLeadershipBoard
                eventResource={eventResource}
                modeResource={modeResource}
              />
            </div>
          );
        })}
      </div>
    );
  }
  return <></>;
};

export default EventLeadershipBoard;
