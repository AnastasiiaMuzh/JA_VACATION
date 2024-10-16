'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'spotimages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://example.com/spot1-image1.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'https://example.com/spot1-image2.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://example.com/spot2-image1.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://example.com/spot2-image2.jpg',
        preview: false,
      }
    ], options, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'spotimages';
    await queryInterface.bulkDelete(options, null, {});
  }
};

