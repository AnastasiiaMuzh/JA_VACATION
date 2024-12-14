import { csrfFetch } from "./csrf";

const ADD_REVIEW = "reviews/ADD_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

const addReviewAction = (review) => ({
  type: ADD_REVIEW,
  payload: review,
});

const deleteReviewsAction = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

export const addReview =
  ({ spotId, review, starRating }) =>
  async (dispatch) => {
    console.log("Spot ID in addReview:", spotId); // Для отладки
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review, stars: starRating }),
      });

      if (response.ok) {
        const newReview = await response.json();
        dispatch(addReviewAction(newReview));
        return newReview;
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  };

  export const deleteReview = (reviewId) => async (dispatch) => {
    console.log("Deleting review ID:", reviewId); // Лог для проверки
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteReviewsAction(reviewId));
    } else {
        console.error("Failed to delete review:", response);
    }
};

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      return { ...state, [action.payload.id]: action.payload };
    }
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
