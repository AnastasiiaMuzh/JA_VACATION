'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Reviews', [
      // Reviews for Spot 1 - App Academy
      {
        spotId: 1,
        userId: 1,
        review: "Fantastic spot, learned a lot!",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 2,
        review: "Great place for development!",
        stars: 4,
      },
      {
        spotId: 1,
        userId: 3,
        review: "Awesome experience, would recommend.",
        stars: 5,
      },
      {
        spotId: 1,
        userId: 4,
        review: "Good but could use more snacks.",
        stars: 4,
      },
      {
        spotId: 1,
        userId: 5,
        review: "A great place for web dev training.",
        stars: 5,
      },
      // Reviews for Spot 2 - Awesome spot
      {
        spotId: 2,
        userId: 1,
        review: "Amazing place, highly recommend!",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 2,
        review: "Had a great time, would come again.",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 3,
        review: "Could have been better.",
        stars: 3,
      },
      {
        spotId: 2,
        userId: 4,
        review: "Beautiful spot, very comfortable.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 5,
        review: "The location is perfect!",
        stars: 5,
      },
      // Reviews for Spot 3 - Great spot
      {
        spotId: 3,
        userId: 1,
        review: "A wonderful place to relax.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 2,
        review: "Clean and well-maintained.",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: "Loved the atmosphere, very cozy.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 4,
        review: "Pretty nice, would come again.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 5,
        review: "Great views and peaceful area.",
        stars: 5,
      },


      // Reviews for Spot 4 - Amazing spot
      {
        spotId: 4,
        userId: 1,
        review: "Amazing people and vibes!",
        stars: 5,
      },
      {
        spotId: 4,
        userId: 2,
        review: "Nice, but a bit noisy.",
        stars: 3,
      },
      {
        spotId: 4,
        userId: 3,
        review: "Would recommend for the price.",
        stars: 4,
      },
      {
        spotId: 4,
        userId: 4,
        review: "Super friendly staff.",
        stars: 5,
      },
      {
        spotId: 4,
        userId: 5,
        review: "Loved it, definitely coming back.",
        stars: 5,
      },

      // Reviews for Spot 5 - Strange spot
      {
        spotId: 5,
        userId: 1,
        review: "Really strange, but interesting.",
        stars: 4,
      },
      {
        spotId: 5,
        userId: 2,
        review: "Weird in a good way!",
        stars: 5,
      },
      {
        spotId: 5,
        userId: 3,
        review: "Quirky and fun, would come back.",
        stars: 4,
      },
      {
        spotId: 5,
        userId: 4,
        review: "Had a unique experience.",
        stars: 4,
      },
      {
        spotId: 5,
        userId: 5,
        review: "Very strange but enjoyable.",
        stars: 4,
      },

      // Reviews for Spot 6 - Caps House
      {
        spotId: 6,
        userId: 1,
        review: "Best spot ever, highly recommend!",
        stars: 5,
      },
      {
        spotId: 6,
        userId: 2,
        review: "Had a great time, awesome house.",
        stars: 5,
      },
      {
        spotId: 6,
        userId: 3,
        review: "Perfect for a weekend getaway.",
        stars: 4,
      },
      {
        spotId: 6,
        userId: 4,
        review: "A cozy and comfortable stay.",
        stars: 4,
      },
      {
        spotId: 6,
        userId: 5,
        review: "Amazing decor and ambiance.",
        stars: 5,
      },

      // Reviews for Spot 7 - The Web
      {
        spotId: 7,
        userId: 1,
        review: "Dark and mysterious, just my style!",
        stars: 5,
      },
      {
        spotId: 7,
        userId: 2,
        review: "Cool but a bit spooky.",
        stars: 4,
      },
      {
        spotId: 7,
        userId: 3,
        review: "Loved the atmosphere, perfect for introverts.",
        stars: 5,
      },
      {
        spotId: 7,
        userId: 4,
        review: "Unique and fascinating experience.",
        stars: 4,
      },
      {
        spotId: 7,
        userId: 5,
        review: "Not for everyone, but I enjoyed it.",
        stars: 4,
      },

      // Reviews for Spot 8 - The SpeedForce
      {
        spotId: 8,
        userId: 1,
        review: "Fastest service I've ever had!",
        stars: 5,
      },
      {
        spotId: 8,
        userId: 2,
        review: "Zoomed right through my expectations.",
        stars: 4,
      },
      {
        spotId: 8,
        userId: 3,
        review: "Could barely keep up, it was that good!",
        stars: 5,
      },
      {
        spotId: 8,
        userId: 4,
        review: "Great service but a bit rushed.",
        stars: 3,
      },
      {
        spotId: 8,
        userId: 5,
        review: "Lightning fast, loved it.",
        stars: 5,
      },

      // Reviews for Spot 9 - Bearded Palace
      {
        spotId: 9,
        userId: 1,
        review: "The palace of beards, what more could you want?",
        stars: 5,
      },
      {
        spotId: 9,
        userId: 2,
        review: "Very cool, unique vibe.",
        stars: 4,
      },
      {
        spotId: 9,
        userId: 3,
        review: "Love the theme, a fun place to stay.",
        stars: 5,
      },
      {
        spotId: 9,
        userId: 4,
        review: "Beards everywhere, it was awesome.",
        stars: 5,
      },
      {
        spotId: 9,
        userId: 5,
        review: "Had a great time, fun place.",
        stars: 5,
      },

      // Reviews for Spot 10 - The Moose Castle
      {
        spotId: 10,
        userId: 1,
        review: "Moose-tastic! Best place ever.",
        stars: 5,
      },
      {
        spotId: 10,
        userId: 2,
        review: "Moose everywhere, loved it.",
        stars: 5,
      },
      {
        spotId: 10,
        userId: 3,
        review: "Great place, moose-themed and fun.",
        stars: 4,
      },
      {
        spotId: 10,
        userId: 4,
        review: "Moose Castle is a must-see!",
        stars: 5,
      },
      {
        spotId: 10,
        userId: 5,
        review: "Loved the moose, the castle was epic.",
        stars: 5,
      },
    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', options);
  }
};
