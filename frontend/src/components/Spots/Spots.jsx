import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();

    // Получаем список объектов из Redux store
    const spots = useSelector((state) => state.spots.spots);

    useEffect(() => {
        dispatch(getSpots()); //Загружаем объекты при монтировании компонента
    }, [dispatch]);



    return (
        <div className="spots-container">
            {spots.map((spot) => (
                <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-box">
                    {/*<div title={spot.name}>*/}
                    <img src={`http://localhost:8000/${spot.previewImage}`} alt={spot.name} />
                    {/* Детали под изображением */}
                    <div className="spot-details">
                        <div className="spot-title">{spot.name}</div>
                        <div className="spot-location">
                            {spot.city}, {spot.state}
                        </div>
                        <div className="spot-rating">
                            <FaStar className="fa-star" />{' '}
                            {spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'Naw'}
                        </div>
                        <div className="spot-price">${spot.price} per night</div>
                    </div>
                    {/*</div>*/}
                </Link>
            ))}
        </div>
    )

}

export default Spots;