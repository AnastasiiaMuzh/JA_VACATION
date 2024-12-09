import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from '../../store/spots';
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaStar } from 'react-icons/fa';
import './spotDetail.css';

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
            <section className="spot-header">
                <h1>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
            </section>
            <section className="spot-images">
                <div className="large-image">
                    <img src={spot.previewImage} alt={spot.name} />
                </div>
                <div className="small-images">
                    {spot.SpotImages?.slice(1).map((img) => (
                        <img key={img.id} src={img.url} alt={spot.name} />
                    ))}
                </div>
            </section>
            <section className="host-info">
                <p className="host-name">Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</p>
                <p className="host-description">{spot.description}</p>
            </section>
            <div className="priceReserveBtn-box">
                <p>${spot.price} <span className="night">night</span></p>
                <div className="rating-line">
                    <FaStar className="fa-star" />
                    <span className="rating-value">{spot.avgStarRating}</span>
                    <span className="dot">·</span>
                    <span className="review-count">
                        {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                    </span>
                </div>
                <button onClick={() => alert("Feature Coming Soon...")}>
                    Reserve
                </button>
            </div>
            <div className="reviews-container">
                <section className="reviews">
                    {spot.numReviews > 0 ? (
                        <>
                            <div className="reviews-header">
                                <FaStar className="fa-star" />
                                <span className="rating-value">{spot.avgStarRating}</span>
                                <span className="dot">·</span>
                                <span className="review-count">
                                    {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                                </span>
                            </div>
                            <div className="reviews-list">
                                {spot.Reviews.map((review) => (
                                    <div key={review.id} className="review">
                                        <strong>{review.User.firstName}</strong>
                                        <p className="date">
                                            {new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                        <p>{review.review}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Be the first to post a review!</p>
                    )}
                </section>

            </div>
        </div>
    );
}

export default SpotDetail;
