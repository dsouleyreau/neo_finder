import { useState } from "react";

interface ModalProperties {
  btnText: string;
  title: string;
  children: React.ReactNode;
  close?: boolean | (() => void);
  submit?: boolean | (() => void);
  className?: string;
}

// made with: https://dev.to/ayushdev_24/building-a-modal-using-reactjs-and-tailwindcss-38d0

const Modal: React.FC<ModalProperties> = ({ btnText, title, children, close: close = false, submit = false }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="bg-blue-200 text-black hover:bg-blue-300 active:bg-blue-400
      px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none w-max"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {btnText}
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 bg-gray-600 bg-opacity-50">
            <div className="w-auto m-6 max-w-3xl rounded-lg shadow-lg flex flex-col bg-white text-black">
              <div className="flex items-center justify-between gap-8 py-2 px-4 border-b border-solid border-gray-300">
                <div className="text-2xl font-semibold">{title}</div>
                <button
                  className="bg-transparent border-0 p-0 rotate-45 text-3xl focus:outline-none"
                  onClick={() => setShowModal(false)}
                >
                  +
                </button>
              </div>
              <div className="relative p-6 flex-auto">{children}</div>
              {Boolean(close || submit) && (
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  {Boolean(close) && (
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        if (typeof close === "function") {
                          close();
                        }
                      }}
                    >
                      Close
                    </button>
                  )}
                  {Boolean(submit) && (
                    <button
                      className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        if (typeof submit === "function") {
                          submit();
                        }
                      }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
