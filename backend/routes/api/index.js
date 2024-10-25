// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');


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
const spotimage = require('../../db/models/spotimage.js');
const { where } = require('sequelize');
router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

//Delete a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image = await SpotImage.findByPk(imageId, { //find image by its Id
    include: { //// include the Spot model to find the relationship between the image and the spot
      model: Spot,
      attributes: ['ownerId'] // retrieve only the ownerId of the spot associated with the image
    }
  });

  if (!image) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  };

  if (image.Spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({
    "message": "Successfully deleted"
  })
})

//Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image =  await findOne({ where: { id: imageId }, //find image by its Id
    include: { //// include the Spot model to find the relationship between the image and the spot
      model: Review,
      attributes: ['userId'] // retrieve only the ownerId of the spot associated with the image
    }
  });

  if (!image) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  };

  if (image.Review.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({
    "message": "Successfully deleted"
  })
})

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter);

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});


module.exports = router;