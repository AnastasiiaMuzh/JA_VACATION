import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import "./spotDetail.css";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewsFormModal from "../ReviewsFormModal/ReviewsFormModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

function SpotDetail() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  // Получаю текущего пользователя, текущий спот и отзывы из состояния Redux
  const spot = useSelector((state) => state.spots.singleSpot);
  const currentUser = useSelector((state) => state.session.user);
  // const reviews = useSelector((state) => state.reviews.reviews || []);
  // const reviews = useSelector((state) => Object.values(state.reviews));

  // Условие показа кнопки
  const isOwner = currentUser?.id === spot?.ownerId;
  // Определяем, оставлял ли текущий пользователь уже отзыв
  const PostedReview = spot?.Reviews.some(
    (review) => review.userId === currentUser?.id
  );

  // Может ли пользователь оставить отзыв
  const canPostedReview = currentUser && !isOwner && !PostedReview;

  useEffect(() => {
    dispatch(getSpotById(spotId)); // Загружаем данные о Spot
  }, [dispatch, spotId]);

  // Проверяем, есть ли данные, иначе показываем "Loading..."
  if (!spot) {
    return <div>Loading...</div>;
  }

  // Логика вывода рейтинга:
  // Если кол-во отзывов > 0, показываем средний рейтинг с одним знаком после запятой
  // Если кол-во отзывов = 0, показываем "New"
  const hasReviews = spot.numReviews > 0;
  const rating = hasReviews ? parseFloat(spot.avgStarRating).toFixed(1) : "New";

  // Логика отображения "Review"/"Reviews"
  const reviewText = spot.numReviews === 1 ? "Review" : "Reviews";

  // Логика отображения "Review"/"Reviews"
  const sortedReviews = spot.Reviews
    ? [...spot.Reviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  return (
    <div className="spot-detail-container">
      <section className="spot-header">
        <h1>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
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
        <p className="host-name">
          Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
        </p>
        <p className="host-description">{spot.description}</p>
      </section>
      {/* Блок с ценой и рейтингом */}
      <div className="priceReserveBtn-box">
        <p>
          ${spot.price} <span className="night">night</span>
        </p>
        <div className="rating-line">
          <FaStar className="fa-star" />
          {hasReviews ? (
            <>
              <span className="rating-value">{rating}</span>
              <span className="dot">·</span>
              <span className="review-count">
                {spot.numReviews} {reviewText}
              </span>
            </>
          ) : (
            <span className="rating-new">New</span>
          )}
        </div>
        <button onClick={() => alert("Feature Coming Soon...")}>Reserve</button>
      </div>

      <div className="reviews-container">
        <section className="reviews">
          <div className="reviews-header">
            <FaStar className="fa-star" />
            {hasReviews ? (
              <>
                <span className="rating-value">{rating}</span>
                <span className="dot">·</span>
                <span className="review-count">
                  {spot.numReviews} {reviewText}
                </span>
              </>
            ) : (
              <span className="rating-value">New</span>
            )}
          </div>

          {/* Кнопка "Post Your Review" если можно оставить отзыв */}
          <div className="post-review-btn">
            {canPostedReview && !isOwner && !PostedReview && (
              <OpenModalButton
                modalComponent={<ReviewsFormModal spotId={spotId} />}
                buttonText="Post Your Review"
              />
            )}
          </div>

          {/* Список отзывов */}
          {hasReviews ? (
            <div className="reviews-list">
              {sortedReviews.map((review) => (
                <div key={review.id} className="review">
                  <strong>{review.User.firstName}</strong>
                  <p className="data">
                    {new Date(review.createdAt).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>{review.review}</p>
                  {review.userId === currentUser?.id && (
                    <div>
                      <OpenModalButton
                        modalComponent={
                          <DeleteReviewModal
                            reviewId={review.id}
                            spotId={spotId}
                          />
                        }
                        buttonText="Delete"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Если нет отзывов: "Be the first to post a review!"
            <p>Be the first to post a review!</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default SpotDetail;
