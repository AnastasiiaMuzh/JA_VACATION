import { removeSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";

function DeleteFormModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(removeSpot(spotId));
    closeModal();
  };

  return (
    <div>
      <h2>Confirm Delete</h2>;
      <p>Are you sure you want to remove this spot from the listings?</p>
      <div className="modal-btn">
        <button className="yes-btn" onClick={handleDelete}>
          Yes (Delete Spot)
        </button>
        <button className="no-btn" onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteFormModal;
