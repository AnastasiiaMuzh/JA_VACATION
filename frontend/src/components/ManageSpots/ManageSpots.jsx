import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSpots } from "../../store/spots";
import { removeSpot } from "../../store/spots";
//mport { useModal } from "../../context/Modal";
import { FaStar } from 'react-icons/fa';
import './ManageSpots.css';




const ManageSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    //const { openModal } = useModal();

    const curUser = useSelector((state) => state.session.user);
    const spotsObjects = useSelector((state) => state.spots.spots); //объект всех спотов
    const allSpots = useMemo(() => Object.values(spotsObjects), [spotsObjects]);  // Преобразуем объект в массив

    useEffect(() => {
        dispatch(getSpots())
    }, [dispatch]);

    const handleNewSpotBtn = (e) => {
        e.preventDefault();
        navigate("/spots/new");
    }

    const handleDeleteBtn = (spotId) => {
        dispatch(removeSpot(spotId));
    };

    const spotOwner = allSpots?.filter((spot) => spot.ownerId === curUser?.id);
    if(!curUser || !spotOwner) <div>Loading...</div>

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
                                <img src={spot.previewImage} alt={spot.name} />
                                <div className="city-rating">
                                <p>{spot.city}, {spot.state}</p>
                                <p>
                                <FaStar className="fa-star" />
                                    {spot.avgRating || "New"}
                                </p>
                                </div>
                                <p className="price">${spot.price} night</p>
                                <div className="spots-btns">
                                    <button className="update" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
                                    <button className="delete" onClick={() => handleDeleteBtn(spot.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No spots yet. Click  &quot;Create a New Spot to add your first spot!</p>
                    )}
                </div>

            </section>

        </div>
    )

}
export default ManageSpots;