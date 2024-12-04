const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT'

const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    payload: spots,
})

const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
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

const initialState = { spots: [], singleSpot: null };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            return { ...state, spots: action.payload }
        }
        case LOAD_SINGLE_SPOT:
            return { ...state, singleSpot: action.payload } // Обновляем `singleSpot`
        default:
            return state;
    }
}


export default spotsReducer;