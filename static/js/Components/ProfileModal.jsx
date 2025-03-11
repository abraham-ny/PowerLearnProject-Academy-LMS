import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function ProfileModal({
  modalOpen,
  title,
  children,
  small,
  modalClose,
}) {
  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={modalClose}>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-2"
            onClick={modalClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${
                  small ? 'max-w-md' : 'max-w-3xl'
                } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-2"
                    onClick={modalClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
