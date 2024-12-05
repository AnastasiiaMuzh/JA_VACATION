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
                    {/* Изображение */}
                    <img
                        src={`http://localhost:8000/${spot.previewImage}`}
                        alt={spot.name}
                    />
                    {/* Детали */}
                    <div className="spot-details">
                        {/* Локация и рейтинг */}
                        <div className="spot-location">
                            <div>
                                {spot.city}, {spot.state}
                            </div>
                            <div className="spot-rating">
                                <FaStar className="fa-star" />
                                {spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}
                            </div>
                        </div>
                        {/* Цена */}
                        <div className="spot-price">
                            <span className="price">${spot.price}</span> <span className="night">night</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );


}

export default Spots;