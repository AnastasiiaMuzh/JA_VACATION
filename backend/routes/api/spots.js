const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImages } = require('../../db/models');
const { where } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json({ Spots: spots });
})

//Get all Spots owned by the Current User
router.get('/current', async (req, res) => {
    const userId = req.user.id; // Adjust this if your user info is stored differently
    const spots = await Spot.findAll({
        where: {
            ownerId: userId // Adjust this to match your Spot model's user association
        }
    })
    return res.json({ Spots: spots });
});


module.exports = router;