const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { where } = require('sequelize');
const { validateReview, validateSpot } = require('../../utils/validation');
const { Op, fn, col, Sequelize } = require("sequelize");

const router = express.Router();

// Add Query Filters to Get All Spots
router.get('/', async (req, res) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pageNum = parseInt(page);
    const sizeNum = parseInt(size);

    const errors = {};
    // Проверка параметров
    if (isNaN(pageNum) || pageNum < 1) errors.page = "Page must be greater than or equal to 1";
    if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 20) errors.size = "Size must be between 1 and 20";
    if (maxLat !== undefined && (isNaN(parseFloat(maxLat)) || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
    if (minLat !== undefined && (isNaN(parseFloat(minLat)) || minLat < -90)) errors.minLat = "Minimum latitude is invalid";
    if (maxLng !== undefined && (isNaN(parseFloat(maxLng)) || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
    if (minLng !== undefined && (isNaN(parseFloat(minLng)) || minLng < -180)) errors.minLng = "Minimum longitude is invalid";
    if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": errors
        });
    }

    const where = {};
    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    const limit = Math.min(sizeNum, 20);
    const offset = (pageNum - 1) * limit;

    // Включаем Review со stars, чтобы получить массив отзывов и вычислить средний рейтинг
    const spots = await Spot.findAll({
        where,
        limit,
        offset,
        attributes: {
            include: [
                // Считаем средний рейтинг через AVG
                [fn('AVG', col('Reviews.stars')), 'avgRating'],
                // Считаем количество отзывов через COUNT
                [fn('COUNT', col('Reviews.id')), 'numReviews']
            ]
        },
        include: [
            {
                model: SpotImage,
                as: "SpotImages",
                where: { preview: true },
                required: false,
                attributes: ["url"],
            },
            {
                model: Review,
                attributes: [],
            },
        ],
        group: ["Spot.id", "SpotImages.id"],
        subQuery: false,
    });

    const result = spots.map((spot) => {
        const spotJSON = spot.toJSON();

        // spotJSON.avgRating теперь — строка или число, возвращённое AVG.
        // Если отзывов нет, AVG вернёт null. Если есть дробное число, вы получите точное дробное значение.
        const avgRatingVal = spotJSON.avgRating !== null ? Number(spotJSON.avgRating) : null;

        // Добавляем поле numReviews (оно уже подсчитано в запросе)
        const numReviewsVal = spotJSON.numReviews !== null ? Number(spotJSON.numReviews) : 0;

        return {
            id: spotJSON.id,
            ownerId: spotJSON.ownerId,
            address: spotJSON.address,
            city: spotJSON.city,
            state: spotJSON.state,
            country: spotJSON.country,
            lat: spotJSON.lat ? parseFloat(spotJSON.lat) : null,
            lng: spotJSON.lng ? parseFloat(spotJSON.lng) : null,
            name: spotJSON.name,
            description: spotJSON.description,
            price: spotJSON.price ? parseFloat(spotJSON.price) : null,
            createdAt: spotJSON.createdAt,
            updatedAt: spotJSON.updatedAt,
            // Округляем до 1 знака после запятой, если есть рейтинг
            avgRating: avgRatingVal !== null ? avgRatingVal.toFixed(1) : "New",
            numReviews: numReviewsVal, // Добавляем количество отзывов
            previewImage: spotJSON.SpotImages && spotJSON.SpotImages.length > 0
                ? (spotJSON.SpotImages[0].url.startsWith('http')
                    ? spotJSON.SpotImages[0].url
                    : `http://localhost:8000/${spotJSON.SpotImages[0].url}`)
                : null,
        };
    });

    res.json({
        Spots: result,
        page: pageNum,
        size: limit,
    });
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id; // Adjust this if your user info is stored differently
    const spots = await Spot.findAll({
        where: {
            ownerId: userId // Adjust this to match your Spot model's user association
        },
        include: [
            {
                model: SpotImage,
                attributes: ["url"],
                where: { preview: true },
                required: false,

            },
            {
                model: Review,
                attributes: [],
            },
        ],
    });

    const result = spots.map((spot) => {
        const numReviews = spot.Reviews ? spot.Reviews.length : 0;
        const avgRating = numReviews > 0
            ? spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews
            : 0;
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat ? parseFloat(spot.lat) : null,
            lng: spot.lng ? parseFloat(spot.lng) : null,
            name: spot.name,
            description: spot.description,
            price: spot.price ? parseFloat(spot.price) : null,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.dataValues.avgRating
                ? parseFloat(spot.dataValues.avgRating)
                : null,// ybrala toFixed

            previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
        };
    });
    return res.status(200).json({ Spots: result });
});


//Get details of a Spot from an SpotId
router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;

    // Ищем спот по ID, сразу подтягивая изображения, владельца и отзывы
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                // Включаем отзывы, чтобы сразу получить их список
                model: Review,
                attributes: ['id', 'userId', 'review', 'stars', 'createdAt', 'updatedAt'],
                include: {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            }
        ]
    });

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    }

    // Превращаем найденный спот в простой объект
    const spotData = spot.toJSON();

    // Обрабатываем изображения: если url не начинается с http, добавляем префикс
    spotData.SpotImages = spotData.SpotImages.map(img => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `http://localhost:8000/${img.url}`
    }));

    // Подсчитываем число отзывов и средний рейтинг
    const reviews = spotData.Reviews || [];
    const numReviews = reviews.length;
    const avgStarRating = numReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews)
        : null;

    // Находим превью-изображение
    const preview = spotData.SpotImages.find(img => img.preview);
    spotData.previewImage = preview ? preview.url : (spotData.SpotImages[0]?.url || null);

    // Формируем итоговый объект деталей спота
    const spotDetails = {
        id: spotData.id,
        ownerId: spotData.ownerId,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        country: spotData.country,
        lat: spotData.lat,
        lng: spotData.lng,
        name: spotData.name,
        description: spotData.description,
        price: spotData.price,
        createdAt: spotData.createdAt,
        updatedAt: spotData.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating !== null ? avgStarRating.toFixed(1) : 0,
        SpotImages: spotData.SpotImages,
        Owner: spotData.User,
        previewImage: spotData.previewImage,
        Reviews: reviews // Возвращаем массив отзывов

    };

    return res.json(spotDetails);
});


//Create a Spot
// router.post('/', requireAuth, validateSpot, async (req, res) => {
//     const { address, city, state, country, lat, lng, name, description, price } = req.body;
//     const ownerId = req.user.id;
//     const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

//     return res.status(201).json({
//         id: spot.id,
//         ownerId: spot.ownerId,
//         address: spot.address,
//         city: spot.city,
//         state: spot.state,
//         country: spot.country,
//         lat: spot.lat ? parseFloat(spot.lat) : null,
//         lng: spot.lng ? parseFloat(spot.lng) : null,
//         name: spot.name,
//         description: spot.description,
//         price: spot.price ? parseFloat(spot.price) : null,
//         createdAt: spot.createdAt,
//         updatedAt: spot.updatedAt,
//     });
// });

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price, SpotImages } = req.body;
    const ownerId = req.user.id;

    const spot = await Spot.create({  // Cоздаём сам спот
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    // Если в теле запроса есть картинки, добавляем их в базу
    if (SpotImages && SpotImages.length > 0) {
        for (const image of SpotImages) {
            await SpotImage.create({
                spotId: spot.id,
                url: image.url,
                preview: image.preview || false
            });
        }
    }

    // Теперь получаем обновлённые данные о споте вместе с его изображениями
    const newSpotWithImages = await Spot.findByPk(spot.id, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    });

    const spotData = newSpotWithImages.toJSON();
    // Добавляем абсолютный путь к изображениям
    spotData.SpotImages = spotData.SpotImages.map(img => ({
        ...img,
        url: `http://localhost:8000/${img.url}`
    }));

    const preview = spotData.SpotImages.find(img => img.preview);
    spotData.previewImage = preview ? preview.url : (spotData.SpotImages[0]?.url || null);

    return res.status(201).json(spotData);

});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));// we find spot

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
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

    const spot = await Spot.findByPk(Number(spotId));

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    const updateSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });

    return res.status(200).json(updateSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    await spot.destroy();
    return res.status(200).json({
        "message": "Successfully deleted"
    })
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(Number(spotId));
    if (!spot) return res.status(404).json({ "message": "Spot couldn't be found" });

    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url'],
            }
        ]
    })
    const formattedReviews = reviews.map(review => {
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName
            },
            ReviewImages: review.ReviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        };
    });
    return res.json({ Reviews: formattedReviews });
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));
    console.log("Checking existing review for spotId:", spotId, "and userId:", userId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    const existsReview = await Review.findOne({
        where: { spotId, userId },
    });
    if (existsReview) {
        return res.status(500).json({ "message": "User already has a review for this spot" });
    };

    const newReview = await Review.create({
        userId, spotId, review, stars,
    });
    return res.status(201).json(newReview);

});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    // Find the spot to check if the current user is the owner
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
        });
    }

    // Fetch all bookings for the spot
    const bookings = await Booking.findAll({
        where: { spotId: spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
        ],
    });

    // Check if the current user is the owner of the spot
    if (spot.ownerId !== userId) {
        // If NOT the owner, return only spotId, startDate, and endDate
        const formattedBookings = bookings.map((booking) => ({
            spotId: booking.spotId,
            startDate: booking.startDate,
            endDate: booking.endDate,
        }));

        return res.json({ Bookings: formattedBookings });
    } else {
        // If the owner, return additional details including user info
        const formattedBookings = bookings.map((booking) => ({
            User: {
                id: booking.User.id,
                firstName: booking.User.firstName,
                lastName: booking.User.lastName,
            },
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        }));

        return res.json({ Bookings: formattedBookings });
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    };

    const bookConf = await Booking.findOne({
        where: {
            spotId,
            [Op.or]: [{
                startDate: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                    //[Op.gte]: endDate
                },
                endDate: {
                    [Op.lte]: endDate,
                    [Op.gte]: startDate
                }
            }]
        }
    })
    if (bookConf) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        });
    };

    if (startDate > endDate || startDate < new Date() || endDate === startDate) {
        return res.status(400).json({
            "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
            "errors": {
                "startDate": "startDate cannot be in the past",
                "endDate": "endDate cannot be on or before startDate"
            }
        })
    }

    const newBooking = await Booking.create({
        spotId, userId, startDate, endDate
    });

    const formatDate = {
        ...newBooking.toJSON(),
        // createdAt: new Date(newBooking.createdAt).toLocaleString('en-US', { timeZone: 'UTC', hour12: false }),
        // updatedAt: new Date(newBooking.updatedAt).toLocaleString('en-US', { timeZone: 'UTC', hour12: false }),
        createdAt: new Date(newBooking.createdAt).toISOString().replace('T', ' ').split('.')[0], // Формат YYYY-MM-DD HH:mm:ss
        updatedAt: new Date(newBooking.updatedAt).toISOString().replace('T', ' ').split('.')[0]  // Формат YYYY-MM-DD HH:mm:ss
    };
    return res.status(201).json(formatDate);
});



module.exports = router;