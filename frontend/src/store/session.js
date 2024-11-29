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

const initialState = { user: null };

//Создаем редюсер для управления состоянием:
const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
        case REMOVE_USER:
            return { ...state, user: null };
        default:
            return state;
    }
};

export default sessionReducer;





