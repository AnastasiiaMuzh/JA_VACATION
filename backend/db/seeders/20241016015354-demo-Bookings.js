'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-07'),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2024-12-10'),
        endDate: new Date('2024-12-15'),
      },
      {
        spotId: 1,
        userId: 3,
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-20'),
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-05'),
      }
    ], options, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', options), {};
  }
};

