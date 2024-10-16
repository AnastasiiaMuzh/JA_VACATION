'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ReviewImages", [
      {
        reviewId: 1,
        url: 'https://example.com/review-image1.jpg',
      },
      {
        reviewId: 2,
        url: 'https://example.com/review-image2.jpg',
      },
      {
        reviewId: 3,
        url: 'https://example.com/review-image3.jpg',
      },
      {
        reviewId: 4,
        url: 'https://example.com/review-image4.jpg',
      },
      {
        reviewId: 5,
        url: 'https://example.com/review-image5.jpg',
      },
      {
        reviewId: 6,
        url: 'https://example.com/review-image6.jpg',
      },
      {
        reviewId: 7,
        url: 'https://example.com/review-image7.jpg',
      },
      {
        reviewId: 8,
        url: 'https://example.com/review-image8.jpg',
      },
      {
        reviewId: 9,
        url: 'https://example.com/review-image9.jpg',
      },
      {
        reviewId: 10,
        url: 'https://example.com/review-image10.jpg',
      },
    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ReviewImages", options);
  }
};
