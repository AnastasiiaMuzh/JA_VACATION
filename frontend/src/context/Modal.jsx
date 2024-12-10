import { useRef, createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext(); //Это как "диспетчер" модального окна. Он отвечает за то, чтобы:
/*Это "хранилище" для данных о модальном окне:
Что показывать в модальном окне (modalContent).
Как закрывать модальное окно (closeModal).
*/

export function ModalProvider({ children }) { //Это "обёртка", которая создаёт контекст для модального окна.
    const modalRef = useRef(); //modalRef используется для получения ссылки на реальный DOM-элемент <div>, куда мы будем рендерить наше модальное окно.
    const [modalContent, setModalContent] = useState(null); //хранит содержимое модального окна (например, форму логина).
    const [onModalClose, setOnModalClose] = useState(null); // закрывает модальное окно.

    const closeModal = () => {
        setModalContent(null);
        if (typeof onModalClose === 'function') {
            onModalClose();
            setOnModalClose(null);
        }
    };

    const contextValue = {
        modalRef,
        modalContent,
        setModalContent,
        setOnModalClose,
        closeModal,
    };

    return (
        <>
            <ModalContext.Provider value={contextValue}>
                {children}
            </ModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    // If there is no div referenced by the modalRef or modalContent is not a
    // truthy value, render nothing:
    if (!modalRef || !modalRef.current || !modalContent) return null;

    // Render the following component to the div referenced by the modalRef
    return ReactDOM.createPortal(
        <div id="modal">
            <div id="modal-background" onClick={closeModal} />
            <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
    );
}

export const useModal = () => useContext(ModalContext);


