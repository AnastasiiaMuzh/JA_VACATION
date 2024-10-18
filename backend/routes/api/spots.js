const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review } = require('../../db/models');
const { where } = require('sequelize');

const router = express.Router();

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

//Get details of a Spot from an id
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




module.exports = router;