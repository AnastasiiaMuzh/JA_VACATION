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
        // console.log(spots);
    }, [dispatch]);
    if (!spots) {
        return <div>Loading...</div>;
    }
    

    return (
        <div className="spots-container">
            {spots.map((spot) => {
                const hasReviews = spot.numReviews > 0;
                const rating = hasReviews
                ? parseFloat(spot.avgRating).toFixed(1)
                : 'New';
                const reviewCount = spot.numReviews;
                const reviewText = reviewCount === 1 ? 'review' : 'reviews';

                return (
                    <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-box" title={spot.name}>
                        <img src={spot.previewImage} alt={spot.name} />
                        {/* <div className='tooltip'>{spot.name}</div> */}
                        <div className="spot-details">
                            <div className="spot-location">
                                <div>{spot.city}, {spot.state}</div>
                                <div className="spot-rating">
                                    <FaStar className="fa-star" />
                                    {hasReviews ? (
                                        <>
                                        {rating} · {reviewCount} {reviewText}
                                        </>
                                    ) : (
                                        <>New</>
                                    )}
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
