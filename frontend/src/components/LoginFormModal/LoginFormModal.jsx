import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';


function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [isDisabled, setIsDisabled] = useState(true); // Для управления кнопкой

    const validateLogin = (username, password) => {
        return username.length >= 4 && password.length >= 6;
    }

    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
        setIsDisabled(!validateLogin(credential, value));
    }


    const handleCredential = (e) => {
        const value = e.target.value;
        setCredential(value);
        setIsDisabled(!validateLogin(value, password));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };
    const handleDemoUser = async () => {
        setCredential("impulseFlash3");
        setPassword("ZoomMustDie333*#");

        try {
            // Отправляем запрос на логин через dispatch
            await dispatch(sessionActions.login({ credential: "impulseFlash3", password: "ZoomMustDie333*#" }));
            closeModal(); // Закрываем модальное окно, если логин успешен
        } catch (err) {
            // Если произошла ошибка, обработаем её
            const data = await err.json();
            if (data && data.errors) {
                setErrors(data.errors); // Устанавливаем ошибки в state
            }
        }
    };



    return (
        <div className='login-form-container'>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                {errors.credential && (
                    <p className='error-message'>{errors.credential}</p>
                )}
                <label>
                    Username or email
                    <input
                        type="text"
                        value={credential}
                        onChange={handleCredential}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePassword}
                        required
                    />
                </label>
                <button type="submit" disabled={isDisabled}>Log In</button>
                <a href="#" className='demo-user-btn' onClick={handleDemoUser}>
                    Demo User
                </a>
            </form>
        </div>
    );
}

export default LoginFormModal;