import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSpots } from '../../store/spots';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './Spots.css';

function Spots() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.spots);

    useEffect(() => {
        dispatch(getSpots());
    }, [dispatch]);

    if (!spots) {
        return <div>Loading...</div>;
    }
    

    return (
        <div className="spots-container">
            {spots.map((spot) => {
                const rating = spot.avgRating || 'New';
                return (
                    <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-box">
                        <img
                            src={spot.previewImage}
                            alt={spot.name}
                        />
                        <div className="spot-details">
                            <div className="spot-location">
                                <div>{spot.city}, {spot.state}</div>
                                <div className="spot-rating">
                                    <FaStar className="fa-star" />
                                    {rating}
                                </div>
                            </div>
                            <div className="spot-price">
                                <span className="price">${spot.price}</span> <span className="night">night</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default Spots;
