// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');


// GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'freddyTheDragon1'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// Fetch request for setting the token cookie
/*

*yourUsername is either freddyTheDragon1, impulseFlash3, NazzieMoose7, BarryBee23, or JohnnyPeace12. FOR NOW*

fetch('/api/set-token-cookie?username="*yourUsername*"')
  .then(res => res.json())
  .then(data => console.log(data));
*/

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use('/session', sessionRouter);
router.use('/users', usersRouter);


router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;