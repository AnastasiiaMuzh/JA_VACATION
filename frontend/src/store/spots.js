import { csrfFetch } from './csrf';
// Action type
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const ADD_NEW_SPOT = 'spots/ADD_NEW_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';
const UPDATE_SPOT = 'spot/UPDATE_SPOT';

// Action creator
const loadSpotsAction = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots,
})

const loadSingleSpotAction = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    payload: spot,
})

const addSpotAction = (spot) => ({
    type: ADD_NEW_SPOT,
    payload: spot,
})

const removeSpotAction = (spotId) => ({
    type: REMOVE_SPOT,
    payload: spotId,
})

const updateSpotAction = (spot) => ({
    type: UPDATE_SPOT,
    payload: spot,
})

// Thunk
export const getSpots = () => async (dispatch) => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const data = await response.json();
        dispatch(loadSpotsAction(data.Spots));
    }
}


export const getSpotById = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSingleSpotAction(spot)); // Отправляем данные в редьюсер
    }
}

export const createSpot = (spot) => async (dispatch) => {
    const response = await csrfFetch("/api/spots/", {
        method: "POST",
        body: JSON.stringify(spot),
    });
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpotAction(newSpot));
        return newSpot;
    } else {
        const errors = await response.json();
        return errors;
    }
}


export const editSpot = (spotId, spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spotData),
    })
    if(response.ok) {
        const updateSpot = await response.json();
        dispatch(updateSpotAction(updateSpot));
        return updateSpot;
    }
}

export const removeSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    })
    if (response.ok) {
        dispatch(removeSpotAction(spotId));
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
        case ADD_NEW_SPOT: {
            return {
                ...state,
                spots: [...state.spots, action.payload],
            };
        }
        case REMOVE_SPOT: {
            // Удаляем спот из массива spots
            const filteredSpots = state.spots.filter((spot) => spot.id !== action.payload);
            return { ...state, spots: filteredSpots };
        }
        case UPDATE_SPOT: {
            const updatedSpot = action.payload;
            return {
                ...state,
                 spots: state.spots.map((spot)=>
                spot.id === updatedSpot.id ? updatedSpot : spot
                ),
                singleSpot: state.singleSpot?.id === updatedSpot.id ? updatedSpot : state.singleSpot,
            }
        }
        default:
            return state;
    }

}


export default spotsReducer;