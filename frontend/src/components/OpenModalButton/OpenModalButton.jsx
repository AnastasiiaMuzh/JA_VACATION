import { useModal } from '../../context/Modal';

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose // optional: callback function that will be called once the modal is closed
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onButtonClick === "function") onButtonClick();
    };

    // const onClick = () => {
    //     if (typeof onButtonClick === 'function') onButtonClick();
    //     setModalContent(modalComponent);
    //     if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    // };

    return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;

/**
 * Объявление функции OpenModalButton:
Принимает пропсы:
modalComponent — React-компонент, который будет отображаться в модальном окне (например, форма логина).
buttonText — строка, определяющая текст кнопки, которая открывает модальное окно.
onButtonClick — (опционально) функция, вызываемая при нажатии на кнопку.
onModalClose — (опционально) функция, вызываемая при закрытии модального окна.
Итог:
Компонент OpenModalButton — это универсальная кнопка для открытия модального окна:

При нажатии на кнопку она:
Выполняет переданную функцию onButtonClick (если она существует).
Устанавливает содержимое модального окна с помощью modalComponent.
Устанавливает функцию для выполнения при закрытии окна (onModalClose), если она предоставлена.
Он очень гибкий и может быть использован с любыми компонентами модального окна.
 */