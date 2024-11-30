//import React from 'react';
import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
    modalComponent, // компонент, который будет отображаться в модальном окне
    itemText, // текст пункта меню, который открывает модальное окно
    onItemClick, // опционально: функция, вызываемая при клике на пункт меню
    onModalClose // опционально: функция, вызываемая при закрытии модального окна
}) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (typeof onItemClick === "function") onItemClick();
    };

    return (
        <li onClick={onClick}>{itemText}</li>
    );
}

export default OpenModalMenuItem;