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

//Thunk restoreUser
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    //if (data.user) {
    dispatch(setUser(data.user)); // Обновляем Redux Store, если пользователь найден
    //}
    return response;
};


//Thunk для входа (login)
export const login = (user) => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        const data = await response.json();
        throw data; // Это позволит блокам catch поймать ошибку
    }

    const data = await response.json();
    dispatch(setUser(data.user));
    return data;
};

//signup Thunk
// export const signup = (user) => async (dispatch) => {
//     const { username, firstName, lastName, email, password } = user;
//     const response = await csrfFetch("/api/users", {
//         method: "POST",
//         body: JSON.stringify({
//             username,
//             firstName,
//             lastName,
//             email,
//             password,
//         }),
//     });
//     const data = await response.json();
//     dispatch(setUser(data.user)); // Устанавливаем пользователя в Redux Store
//     return response;
// };


//signup Thunk
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    try {
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
        return data;
    } catch (error) {
        // Предполагаем, что error.data содержит серверные ошибки
        throw error.data;
    }
};


//logout Thunk:
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE',
    });
    dispatch(removeUser());
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





