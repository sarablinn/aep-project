import { deleteEvent, EventResource } from '../../services/eventApi';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { selectedUser } from '../../services/Atoms';
import { useAtom } from 'jotai';

export type DeleteEventConfirmationPopupProps = {
  showPopup: boolean;
  eventResource: EventResource | null;
};

const DeleteEventConfirmationPopup = ({
  showPopup,
  eventResource,
}: DeleteEventConfirmationPopupProps) => {
  const [currentUser] = useAtom(selectedUser);
  const [showModal, setShowModal] = useState(showPopup);

  const {
    data: deleteEventResults,
    mutate: deleteEventMutation,
    error,
  } = useMutation({
    mutationFn: (event_id: number) => deleteEvent(event_id),
    onMutate: () => console.log('EventsPage: Mutate: deleteEventMutation'),
    onError: (err, variables, context) => {
      console.log(err, variables, context);
    },
    onSuccess: data => {
      console.log('EventsPage: Success: deleteEventMutation:', data);
    },
    onSettled: () => console.log('EventsPage: Settled: deleteEventMutation.'),
  });

  const deleteEventAndReload = () => {
    if (eventResource) {
      deleteEventMutation(eventResource.eventId);
    }
  };

  useEffect(() => {
    if (deleteEventResults) {
      window.location.reload();
    }
  }, [deleteEventResults]);

  return (
    <div>
      {showModal && eventResource && currentUser.roleId === 2 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-3xl">
            {/*content*/}
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
              {/*header*/}
              <h2 className="mb-1 bg-pink-500 px-6 py-3 text-center text-sm font-bold uppercase text-white">
                Delete Event
              </h2>
              <div className="m-3 p-3">
                <p className="mb-8 mt-4 px-4 text-center">
                  Would you like to delete
                  {'\n ' + eventResource.eventName}?
                </p>
                <div className="flex justify-center pb-3">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      window.location.reload();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={() => deleteEventAndReload()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showModal && eventResource && currentUser.roleId === 2 && error ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-3xl">
            {/*content*/}
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
              {/*header*/}
              <h2 className="mb-1 bg-pink-500 px-6 py-3 text-center text-sm font-bold uppercase text-white">
                Delete Event
              </h2>
              <div className="m-3 p-3">
                <p className="mb-8 mt-4 px-4 text-center">
                  Sorry, unable to delete
                  {'\n ' + eventResource.eventName}.
                </p>
                <div className="flex justify-center pb-3">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      window.location.reload();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={() => deleteEventAndReload()}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DeleteEventConfirmationPopup;
