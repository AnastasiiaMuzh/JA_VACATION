import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from '../../store/spots';
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaStar } from 'react-icons/fa';

function SpotDetail() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.singleSpot); // Получаем данные о singleSpot

    useEffect(() => {
        dispatch(getSpotById(spotId)); // Загружаем данные о Spot
    }, [dispatch, spotId]);

    // Проверяем, есть ли данные, иначе показываем "Loading..."
    if (!spot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="spot-detail-container">
            <h1>{spot.name}</h1>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <img src={`http://localhost:8000/backend/images/${spot.previewImage}`} alt={spot.name} />
            <p>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
            <p>{spot.description}</p>
            <div className="callout-box">
                <p>${spot.price} / night</p>
                <FaStar className="fa-star" />{' '}
                <button onClick={() => alert('Feature coming soon!')}>Reserve</button>
            </div>
        </div>
    )
}

export default SpotDetail;