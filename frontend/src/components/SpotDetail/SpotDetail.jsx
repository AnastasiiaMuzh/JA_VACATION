import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from '../../store/spots';
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function SpotDetail() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.singleSpot); // Получаем данные о singleSpot

    useEffect(() => {
        dispatch(getSpotById(spotId)); // Загружаем данные о Spot
    }, [dispatch, spotId]);

    // Проверяем, есть ли данные, иначе показываем "Loading..."
    if (!spot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="spot-detail">
            <h1>{spot.name}</h1>
            <p>{spot.description}</p>

        </div>
    )
}

export default SpotDetail;