//определили action
const LOAD_SPOTS = 'spots/LOAD_SPOTS';  //для загрузки всех спотов.
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT'; //для загрузки одного конкретного спота.
const ADD_NEW_SPOT = 'spots/ADD_NEW_SPOT'; // для добавления нового спота.

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots,
})

const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    payload: spot,
})

const addSpot = (spot) => ({
    type: ADD_NEW_SPOT,
    payload: spot,
})


export const getSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpots(data.Spots));
    }
}

export const getSpotById = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSingleSpot(spot)); // Отправляем данные в редьюсер
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const response = await fetch("/api/spots", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spot),
    });
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot));
        return newSpot;
    } else {
        const errors = await response.json();
        return errors; // Возвращаем ошибки
    }
}

const initialState = { spots: [], singleSpot: null };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            return { ...state, spots: action.payload }
        }
        case LOAD_SINGLE_SPOT: {
            return { ...state, singleSpot: action.payload } // Обновляем `singleSpot`
        }
        case ADD_NEW_SPOT:
            return {
                ...state,
                spots: [...state.spots, action.spot],
            };
        default:
            return state;
    }
}


export default spotsReducer;