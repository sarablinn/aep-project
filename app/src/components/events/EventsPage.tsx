import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { selectedUser } from '../../services/Atoms';
import { useState } from 'react';
import Loading from '../../utilities/Loading';
import ErrorMessage from '../../utilities/ErrorMessage';
import { EventResource, getAllEvents } from '../../services/eventApi';
import {
  faTrashCan,
  faPenToSquare,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CreateEventPopup from './CreateEventPopup';
import DeleteEventConfirmationPopup from './DeleteEventConfirmationPopup';
import EditEventPopup from './EditEventPopup';

const EventsPage = () => {
  const { isAuthenticated } = useAuth0();
  const [currentUser] = useAtom(selectedUser);
  const [selectedEvent, setSelectedEvent] = useState<EventResource | null>(
    null,
  );

  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);
  const [showEditEventPopup, setShowEditEventPopup] = useState(false);
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

  const handleEditEventPopup = (eventResource: EventResource) => {
    console.log(eventResource.eventCreatorUserId);
    setSelectedEvent(eventResource);
    showEditEventPopup
      ? setShowEditEventPopup(false)
      : setShowEditEventPopup(true);
    console.log('EventsPage: showEditEventPopup: ' + showEditEventPopup);
    console.log('EventsPage: selectedEvent: ', selectedEvent);
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

  const {
    isLoading: isLoadingEvents,
    error: eventsError,
    data: eventsData,
  } = useQuery({
    queryKey: [`eventsPage`],
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
          {showEditEventPopup && selectedEvent ? (
            <EditEventPopup
              showPopup={showEditEventPopup}
              eventResource={selectedEvent}
            />
          ) : null}
          {showDeleteEventPopup && selectedEvent ? (
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
              {eventsData.length > 0 ? (
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
                        <td className="p-5">
                          {eventResource.eventGames.length}
                        </td>
                        <td className="p-5">
                          <FontAwesomeIcon
                            className="fa-2x p-5 text-white hover:text-pink-400 active:text-pink-600"
                            icon={faPenToSquare}
                            onClick={() => {
                              handleEditEventPopup(eventResource);
                            }}
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
              ) : (
                <div>
                  <h3>No Events Yet.</h3>
                </div>
              )}
            </div>
          </div>
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
