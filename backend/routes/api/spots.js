const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');
const { where } = require('sequelize');

const router = express.Router();

const validateSpot = (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const errors = {};

    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
    if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
    if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (price <= 0) errors.price = "Price per day must be a positive number";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            "message": "Validation error",
            "errors": errors
        })
    }
    next();
}

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
})

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id; // Adjust this if your user info is stored differently
    const spots = await Spot.findAll({
        where: {
            ownerId: userId // Adjust this to match your Spot model's user association
        }
    })
    return res.json({ Spots: spots });
});

//Get details of a Spot from an SpotId
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                //as: 'Owner', //maybe need to add the user(model) as:owner?
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    const reviews = await Review.findAll({
        where: { spotId }
    });
    const numReviews = reviews.length;
    const avgStarRating = numReviews > 0
        ? reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews
        : 0;

    const spotDetails = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating.toFixed(1),// Round to one decimal place
        SpotImages: spot.SpotImages,
        Owner: spot.User
    };

    return res.json(spotDetails);
});

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    return res.status(201).json({ spot });
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);// we find spot

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Authentication required" });
    }

    const createImage = await SpotImage.create({
        spotId: spot.id,
        url,
        preview,
    })

    return res.status(201).json({
        id: createImage.id,
        url: createImage.url,
        preview: createImage.preview,
    });
});

//Edit a Spot

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Authentication required" });
    }

    const updateSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });

    return res.status(200).json(updateSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Authentication required" });
    }

    return res.status(200).json({
        "message": "Successfully deleted"
    })
})


module.exports = router;