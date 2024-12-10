// backend/routes/api/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');


//validation for signup
const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required.'),
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



// Sign up
router.post("/", validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    const errors = {};

    // Проверка существующего email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
        errors.email = "User with that email already exists";
    }

    // Проверка существующего username
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
        errors.username = "User with that username already exists";
    }

    // Если есть ошибки, возвращаем их
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            "message": "User already exists",
            "errors": errors
        });
    }

    // Если ошибок нет, создаём пользователя
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

// router.post("/", validateSignup, async (req, res) => {
//     const { firstName, lastName, email, password, username } = req.body;

//     const existingUser = await User.findOne({
//         where: {
//             [Op.or]: [{ email }, { username }]
//         }
//     });

//     if (existingUser) {
//         return res.status(400).json({
//             "message": "User already exists",
//             "errors": {
//                 "email": "User with that email already exists",
//                 "username": "User with that username already exists"
//             }
//         });
//     }

//     const hashedPassword = bcrypt.hashSync(password);
//     const user = await User.create({ firstName, lastName, email, username, hashedPassword });

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




module.exports = router;