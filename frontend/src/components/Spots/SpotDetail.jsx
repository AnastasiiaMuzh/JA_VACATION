import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../store/spots";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function SpotDetail() {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector((state) => state.spots.singleSpot);

    useEffect(() => {
        dispatch(getSpotById(spotId));
    },[dispatch, spotId]);

    return (
        <div className="spot-detail">

        </div>
    )
}