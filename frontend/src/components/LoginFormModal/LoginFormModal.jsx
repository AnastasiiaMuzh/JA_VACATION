import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';
import { restoreCSRF } from '../../store/csrf';

function LoginFormModal() {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);

    // useEffect(() => { 
    //     restoreCSRF(); // Инициализируем CSRF токен при монтировании компонента
    // }, []);

    //  Валидация входных данных
    const validateLogin = (username, password) => {
        return username.trim().length >= 4 && password.trim().length >= 6;
    };

    // Обработчики для инпутов
    const handleCredential = (e) => {
        const value = e.target.value;
        setCredential(value);
        setIsDisabled(!validateLogin(value, password));
    };

    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
        setIsDisabled(!validateLogin(credential, value));
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors

        try {
            await dispatch(sessionActions.login({ credential, password }));
            closeModal(); // Close modal on success
        } catch (err) {
            console.error("Login error:", err); // Для отладки
            if (err.data && err.data.errors) {
                setErrors(err.data.errors);
            } else {
                setErrors({ credential: "An unexpected error occurred." });
            }
        }
    };

    const handleDemoUser = async (e) => {
        e.preventDefault();
        const demoCredential = "impulseFlash3";
        const demoPassword = "ZoomMustDie333*#";
        setCredential(demoCredential);
        setPassword(demoPassword);

        try {
            await dispatch(sessionActions.login({ credential: demoCredential, password: demoPassword }));
            closeModal();
        } catch (err) {
            console.log("demo user err:", err)
            if (err.data && err.data.errors) {
                setErrors(err.data.errors);
            } else {
                setErrors({ credential: "An unexpected error occurred." });
            }
        }
    };

    return (
        <div className="login-form-container">
            <h1>Log In</h1>
            {errors.credential && <p className="error-message">{errors.credential}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input type="text" value={credential} onChange={handleCredential} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={handlePassword} required />
                </label>
                <button type="submit" disabled={isDisabled}>Log In</button>
                <a href='#' className='demo-user-btn' onClick={handleDemoUser}>
                    Demo User
                </a>
            </form>
        </div>
    );
}

export default LoginFormModal;
