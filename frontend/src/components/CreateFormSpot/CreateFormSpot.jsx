import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSpot } from '../../store/spots';
import { useState } from "react";
import './CreateFormSpot.css';

function CreateFormSpot() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [imageUrls, setImageUrls] = useState(['', '', '', '']);
    const [errors, setErrors] = useState({});

    const sessionUser = useSelector((state) => state.session.user);
    if (!sessionUser) {
        return <p>You must be logged in to create a new spot.</p>
    }

    const updateImageUrl = (index, value) => {
        const updatedUrls = [...imageUrls];
        updatedUrls[index] = value;
        setImageUrls(updatedUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        // Валидация других полей
        if (!country) validationErrors.country = "Country is required";
        if (!address) validationErrors.address = "Address is required";
        if (!city) validationErrors.city = "City is required";
        if (!state) validationErrors.state = "State is required";
        if (!description || description.length < 30) validationErrors.description = "Description needs a minimum of 30 characters";
        if (!name) validationErrors.name = "Name is required";
        if (!price || price <= 0) validationErrors.price = "Price must be greater than 0";

        if (!previewImage) {  // Валидация PrevewImage
            validationErrors.previewImage = "Preview image is required.";
        } else if (!previewImage.endsWith('.jpg') && !previewImage.endsWith('.jpeg') && !previewImage.endsWith('.png')) {
            validationErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg.";
        }

        // Валидация остальных изображений (необязательно)
        const invalidUrls = imageUrls.filter(
            (url) => url && !url.endsWith('.jpg') && !url.endsWith('.jpeg') && !url.endsWith('.png')
        );

        if (invalidUrls.length > 0) {
            invalidUrls.forEach((url, index) => {
                validationErrors[`image${index}`] = "Image URL must end in .png, .jpg, or .jpeg.";
            });
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newSpot = {
            country,
            address,
            city,
            state,
            description,
            name,
            price,
            SpotImages: [
                { url: previewImage, preview: true },
                ...imageUrls.filter((url) => url).map((url) => ({ url, preview: false })),
            ],
            lat: 40.7128,    // временно поставьте какое-то значение
            lng: -74.0060,   // временно поставьте какое-то значение
        };

        const createdSpot = await dispatch(createSpot(newSpot));
        if (createdSpot) {
            navigate(`/spots/${createdSpot.id}`);
        }
    }


    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Create a New Spot</h2>
                <h3>Where&apos;s your place located?</h3>
                <p>Guests will only get your exact address once they booked a reservation.</p>
                <div className="input-container">
                    <div className="label-input-error">
                        <label>Country</label>
                        {errors.country && <span className="error">{errors.country}</span>}
                    </div>
                    <input placeholder="Country" type="text" value={country} onChange={(e) => setCountry(e.target.value)}
                    />
                </div>

                <div className="input-container">
                    <div className="label-input-error">
                        <label>Street Address</label>
                        {errors.address && <span className="error">{errors.address}</span>}
                    </div>
                    <input placeholder="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="input-city-state">
                    <div className="city-group">
                        <div className="label-with-error">
                            <label>City</label>
                            {errors.city && <span className="error-inline">{errors.city}</span>}
                        </div>
                        <input
                            placeholder="City"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <span className="comma">,</span>
                    <div className="state-group">
                        <div className="label-with-error">
                            <label>State</label>
                            {errors.state && <span className="error-inline">{errors.state}</span>}
                        </div>
                        <input
                            placeholder="State"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-container-down">
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amenities like fast
                        wifi or parking, and what you love about the neighborhood.</p>
                    {errors.description && <p className="error">{errors.description}</p>}
                    <textarea placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="input-container-down">
                    <div className="label-input-error">
                        <h3>Create a title for your spot</h3>
                        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    </div>
                    {errors.name && <span className="error">{errors.name}</span>}
                    <input placeholder="Name of your spot" type="text" value={name} onChange={(e) => setName(e.target.value)} />

                </div>
                <div className="input-container-down">
                    <div className="price-wrapper">
                        <h3>Set a base price for your spot</h3>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <span className="currency-symbol">$</span>
                        {errors.price && <p className="error">{errors.price}</p>}
                        <input className="price-field" placeholder="Price per night (USD)" type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className="input-container-down">
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div className="image-container">
                        <div className="image-url-container">
                            {errors.previewImage && <p className="error">{errors.previewImage}</p>}
                            <input placeholder="Preview Image URL" type="text" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)}
                            />
                        </div>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="image-url-container">
                                {errors[`image${index}`] && (
                                    <p className="error">{errors[`image${index}`]}</p>
                                )}
                                <input
                                    placeholder="Image URL"
                                    type="text"
                                    value={url}
                                    onChange={(e) => updateImageUrl(index, e.target.value)}
                                />

                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    Create Spot
                </button>
            </form>
        </div>
    )
}
export default CreateFormSpot;

