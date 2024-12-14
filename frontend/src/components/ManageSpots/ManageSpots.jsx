import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpots } from "../../store/spots";
import DeleteFormModal from "../DeleteFormModal/DeleteFormModal";
import { FaStar } from "react-icons/fa";
import "./ManageSpots.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";


const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const curUser = useSelector((state) => state.session.user);
  const spotsObjects = useSelector((state) => state.spots.spots); //объект всех спотов
  const allSpots = useMemo(() => Object.values(spotsObjects), [spotsObjects]); // Преобразуем объект в массив

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);


  const handleNewSpotBtn = () => navigate("/spots/new");


  const spotOwner = allSpots?.filter((spot) => spot.ownerId === curUser?.id);

  if (!curUser || !spotOwner) <div>Loading...</div>;

  return (
    <div className="manage-container">
      <section className="header-spot">
        <h1>Manage Your Spots</h1>
        <div className="new-spot-btn">
          <button onClick={handleNewSpotBtn}>Create a New Spot</button>
        </div>
        <div className="spot-img">
          {spotOwner.length > 0 ? (
            spotOwner.map((spot) => (
              <div key={spot.id} className="spot-title">
                <div
                  className="spot-img-container"
                  onClick={() => navigate(`/spots/${spot.id}`)}
                >
                  <img src={spot.previewImage} alt={spot.name} />
                </div>
                {/* <img src={spot.previewImage} alt={spot.name} /> */}
                <div className="city-rating">
                  <p>
                    {spot.city}, {spot.state}
                  </p>
                  <p>
                    <FaStar className="fa-star" />
                    {spot.avgRating || "New"}
                  </p>
                </div>
                <p className="price">${spot.price} night</p>
                <div className="spots-btns">
                  <button
                    className="update"
                    onClick={() => navigate(`/spots/${spot.id}/edit`)}
                  >
                    Update
                  </button>
                  <button>
                    <OpenModalButton modalComponent={<DeleteFormModal spotId={spot.id} />}
                    buttonText="Delete" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>
              No spots yet. Click &quot;Create a New Spot to add your first
              spot!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
export default ManageSpots;
