import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from '../../store/spots';
import { useState } from "react";

function CreateFormSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sessionUser = useSelector((state) => state.session.user);
    if (!sessionUser) {
        return <p>You must be logged in to create a new spot.</p>;
    };

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataSpot = { country, address, city, state, description, name, price, imageUrl };

        const validationErrors = {};
        if(!country) validationErrors.country = "Country is required";
        if(!address) validationErrors.address = "Address is required";
        if(!city) validationErrors.address = "City is required";
        if(!state) validationErrors.state = "State is required";
        if(!description || description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
        if(!name) validationErrors.name = "Name is required";
        if(!price) validationErrors.price = "Price must be greater than 0";
        if(!imageUrl) {
            validationErrors.imageUrl = "Preview image is required.";
        } else {
            !imageUrl.endsWith('jpg') && !imageUrl.endsWith('jpeg')
        }
    };




}
export default CreateFormSpot;

