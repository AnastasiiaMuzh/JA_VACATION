import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { addReview } from "../../store/reviews";
import { getSpotById } from "../../store/spots";
import './reviewFormModal.css';

const ReviewsFormModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const [review, setReview] = useState('');
    const [starRating, setStarRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState({});

    const handleValidation = () => {
        const validationErrors = {};
        if (review.length < 10) validationErrors.review = 'Review must be at least 10 characters long.';
        return validationErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = handleValidation();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            await dispatch(addReview({ spotId, review, starRating }));
            await dispatch(getSpotById(spotId)); // Обновляем данные спота
            closeModal();
        } catch (res) {
            let data;
            try {
                data = await res.json();
            } catch {
                console.error("paring response error:", res);
            }
            if (data?.errors) {
                setErrors(data.errors)
            } else {
                setErrors({ review: "Review already exists for this spot" })
            }
        }
    };


    return (
        <div className="review-background">
            <div className="new-review">
                <h1>How was your stay?</h1>
                <form onSubmit={handleSubmit}>
                {errors.review && <p className="review-error">{errors.review}</p>}
                {errors.starRating && <p className="review-error">{errors.starRating}</p>}
                    <textarea
                        value={review}
                        placeholder="Leave your review here..."
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                    <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (hoverRating || starRating) ? 'highlighted' : ""}`}
                                onClick={() => setStarRating(star)}
                                onMouseOver={() => setHoverRating(star)}
                                onMouseOut={() => setHoverRating(0)}
                            >
                                ★
                            </span>
                        ))}
                        <span>Stars</span>
                    </div>
                    <button type="submit" disabled={review.length < 10 || !starRating}>
                        Submit Your Review
                    </button>
                </form>

            </div>

        </div>
    )


}

export default ReviewsFormModal;