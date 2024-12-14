import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";
import { getSpotById } from "../../store/spots";

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    console.log();
    await dispatch(deleteReview(reviewId));
    await dispatch(getSpotById(spotId));
    closeModal();
  };

  return (
    <div>
      <h2>Confirm Delete</h2>;
      <p>Are you sure you want to delete this review?</p>
      <div className="modal-btn">
        <button className="yes-btn" onClick={handleDelete}>
          Yes (Delete Review)
        </button>
        <button className="no-btn" onClick={closeModal}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}
export default DeleteReviewModal;
