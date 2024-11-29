import { csrfFetch } from './csrf';

//Если пользователь вошел в систему, в состоянии будет объект с данными пользователя:
// {
//     user: {
//         id,
//             email,
//             username,
//             firstName,
//             lastName
//     }
// }

//Если пользователь не вошел, user будет равен null
//const initialState = { user: null };

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});

const removeUser = () => ({
    type: REMOVE_USER,
});

//Добавляем thunk-действие для входа (login)
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ credential, password }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//Добавить signup Thunk
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user)); // Устанавливаем пользователя в Redux Store
    return response;
  };
  

const initialState = { user: null }; // Начальное состояние

//Создаем редюсер для управления состоянием:
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }; // Добавляем пользователя
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;  // По умолчанию возвращаем текущее состояние
    }
};

export default sessionReducer;





