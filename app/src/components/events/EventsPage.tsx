import { useAuth0 } from '@auth0/auth0-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import { useEffect, useState } from 'react';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import {
  createEvent,
  EventDto,
  EventResource,
  getAllEvents,
} from '../../services/eventApi';
import {
  faTrashCan,
  faPenToSquare,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateEventPopup from './CreateEventPopup';
import DeleteEventConfirmationPopup from './DeleteEventConfirmationPopup';

const EventsPage = () => {
  const { isAuthenticated } = useAuth0();
  const [currentUser] = useAtom(selectedUser);
  const [selectedEvent, setSelectedEvent] = useState<EventResource | null>(
    null,
  );

  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const [showDeleteEventPopup, setShowDeleteEventPopup] = useState(false);

  /**
   * Toggles the visibility status of the popup.
   */
  const handleCreateEventPopup = () => {
    showCreateEventPopup
      ? setShowCreateEventPopup(false)
      : setShowCreateEventPopup(true);
    console.log('EventsPage: showCreateEventPopup: ' + showCreateEventPopup);
  };

  /**
   * Toggles the visibility status of the popup.
   */
  const handleDeleteEventPopup = () => {
    showDeleteEventPopup
      ? setShowDeleteEventPopup(false)
      : setShowDeleteEventPopup(true);
    console.log('EventsPage: showDeleteEventPopup: ' + showDeleteEventPopup);
  };

  useEffect(() => {
    console.log('EventsPage: showDeleteEventPopup: ' + showDeleteEventPopup);
  }, [showCreateEventPopup]);

  const {
    data: createdEventResults,
    mutate: createEventMutation,
    isLoading: loadingCreateEvent,
  } = useMutation({
    mutationFn: (eventDto: EventDto) => createEvent(eventDto),
    onMutate: () => console.log('EventsPage: Mutate: createEventMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log('EventsPage: Success: createEventMutation:', data);
    },
    onSettled: () => console.log('EventsPage: Settled: createEventMutation.'),
  });

  const {
    isLoading: isLoadingEvents,
    error: eventsError,
    data: eventsData,
  } = useQuery({
    queryKey: [`events`],
    queryFn: () => getAllEvents(),
  });

  const formatDate = (date: Date): string => {
    date = new Date(date);
    return (
      date.getMonth() + 1 + '/' + +date.getDate() + '/' + date.getFullYear()
    );
  };

  if (isLoadingEvents) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (eventsError) {
    return (
      <div>
        <ErrorMessage
          errorMessage={'An error has occurred while loading events.'}
        />
      </div>
    );
  } else if (isAuthenticated && currentUser && currentUser.roleId === 2) {
    if (eventsData) {
      return (
        <div>
          {showCreateEventPopup ? (
            <CreateEventPopup showPopup={showCreateEventPopup} />
          ) : null}
          {showDeleteEventPopup ? (
            <DeleteEventConfirmationPopup
              showPopup={showDeleteEventPopup}
              eventResource={selectedEvent}
            />
          ) : null}
          <div className="p-12 text-center text-white">
            <h1 className="p-3 pb-10 text-xl">Events Management</h1>
            <div className="flex flex-col content-center">
              <div
                className="m-5 mb-10 flex flex-col p-5"
                style={{
                  backgroundColor: currentUser.backgroundColor,
                  border: '3px solid',
                  borderRadius: '20px',
                  borderColor: currentUser.foregroundColor,
                }}
              >
                <div className="content-center pb-5">
                  <FontAwesomeIcon
                    className="fa-4x w-15 p-5 text-white hover:text-pink-400 active:text-pink-600"
                    icon={faCirclePlus}
                    onClick={handleCreateEventPopup}
                  ></FontAwesomeIcon>
                  <p>Create Event</p>
                </div>
              </div>
              <table className="mt-5">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Games Played</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsData.map((eventResource, index) => (
                    <tr key={'event-' + index}>
                      <td className="p-5">{eventResource.eventName}</td>
                      <td className="p-5">
                        {formatDate(eventResource.startDate)}
                      </td>
                      <td className="p-5">
                        {formatDate(eventResource.endDate)}
                      </td>
                      <td className="p-5">{eventResource.eventGames.length}</td>
                      <td className="p-5">
                        <FontAwesomeIcon
                          className="fa-2x p-5 text-white hover:text-pink-400 active:text-pink-600"
                          icon={faPenToSquare}
                        />
                      </td>
                      <td className="p-5">
                        <FontAwesomeIcon
                          className="fa-2x p-5 text-white hover:text-pink-400 active:text-pink-600"
                          icon={faTrashCan}
                          onClick={() => {
                            setSelectedEvent(eventResource);
                            handleDeleteEventPopup();
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )
        </div>
      );
    }
  } else if (isAuthenticated && currentUser && currentUser.roleId != 2) {
    return (
      <div className="p-12 text-center font-bold text-white">
        <h1>Unauthorized User</h1>
      </div>
    );
  }
  return <></>;
};

export default EventsPage;
