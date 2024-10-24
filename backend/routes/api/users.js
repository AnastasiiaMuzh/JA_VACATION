// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, validateUserBody } = require('../../utils/validation');
const { Op } = require('sequelize');


//validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];
//validation for signup
// const validateSignup = [
//     check('email')
//         .exists({ checkFalsy: true })
//         .isEmail()
//         .withMessage('Invalid email'),
//     check('username')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 4 })
//         .withMessage('Username is required'),
//     check('username')
//         .not()
//         .isEmail()
//         .withMessage('Username cannot be an email.'),
//     check('password')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 6 })
//         .withMessage('Password must be 6 characters or more.'),
//     check('firstName')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 4 })
//         .withMessage('First Name is required'),
//     check('lastName')
//         .exists({ checkFalsy: true })
//         .isLength({ min: 4 })
//         .withMessage('Last Name is required'),
//     handleValidationErrors
// ];

// Sign up
// router.post("/", validateSignup, async (req, res) => {
//     const { firstName, lastName, email, password, username } = req.body;
//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ firstName, lastName, email, username, hashedPassword });

//     if (email || username) {
//         return res.status(500).json({
//             "message": "User already exists",
//             "errors": {
//                 "email": "User with that email already exists",
//                 "username": "User with that username already exists"
//             }
//         })
//     }

//     const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.status(201).json({
//         user: safeUser,
//     });
// });

// Sign up
router.post("/", validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { username }]
        }
    });

    if (existingUser) {
        return res.status(500).json({
            "message": "User already exists",
            "errors": {
                "email": "User with that email already exists",
                "username": "User with that username already exists"
            }
        });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(201).json({
        user: safeUser,
    });
});




module.exports = router;