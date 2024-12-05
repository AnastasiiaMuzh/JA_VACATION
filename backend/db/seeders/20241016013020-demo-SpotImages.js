//seeders spotImages
'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'backend/images/appAcademy/aA.png',
        //url: 'https://travel-curious.com/wp-content/uploads/2022/10/Bishop-Castle-Colorado-3-726x1024.jpg',
        preview: true,
      },
      {
        spotId: 1,
        url: 'backend/images/appAcademy/aA1.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'backend/images/appAcademy/aA2.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'backend/images/appAcademy/aA3.png',
        preview: false,
      },
      {
        spotId: 1,
        url: 'backend/images/appAcademy/aA4.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'backend/images/awesom/awesomFront.png',
        preview: true,
      },
      {
        spotId: 2,
        url: 'backend/images/awesom/awesom1.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'backend/images/awesom/awesom2.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'backend/images/awesom/awesom3.png',
        preview: false,
      },
      {
        spotId: 2,
        url: 'backend/images/awesom/awesome4.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'backend/images/great/greatFront.png',
        preview: true,
      },
      {
        spotId: 3,
        url: 'backend/images/great/great1.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'backend/images/great/great2.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'backend/images/great/great3.png',
        preview: false,
      },
      {
        spotId: 3,
        url: 'backend/images/great/great4.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'backend/images/amazing/amazingFront.png',
        preview: true,
      },
      {
        spotId: 4,
        url: 'backend/images/amazing/amazing1.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'backend/images/amazing/amazing2.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'backend/images/amazing/amazing3.png',
        preview: false,
      },
      {
        spotId: 4,
        url: 'backend/images/amazing/amazing4.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'backend/images/strange/str.png',
        preview: true,
      },
      {
        spotId: 5,
        url: 'backend/images/strange/str1.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'backend/images/strange/str2.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'backend/images/strange/str3.png',
        preview: false,
      },
      {
        spotId: 5,
        url: 'backend/images/strange/str4.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'backend/images/caps/capsFront.png',
        preview: true,
      },
      {
        spotId: 6,
        url: 'backend/images/caps/caps1.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'backend/images/caps/caps2.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'backend/images/caps/caps3.png',
        preview: false,
      },
      {
        spotId: 6,
        url: 'backend/images/caps/caps4.png',
        preview: false,
      },
      {
        spotId: 7,
        url: 'backend/images/theWeb/web.png',
        preview: true,
      },
      {
        spotId: 7,
        url: 'backend/images/theWeb/web1.png',
        preview: false,
      },
      {
        spotId: 7,
        url: 'backend/images/theWeb/web2.png',
        preview: false,
      },
      {
        spotId: 7,
        url: 'backend/images/theWeb/web3.png',
        preview: false,
      },
      {
        spotId: 7,
        url: 'backend/images/theWeb/web4.png',
        preview: false,
      },
      {
        spotId: 8,
        url: 'backend/images/speed/speed.png',
        preview: true,
      },
      {
        spotId: 8,
        url: 'backend/images/speed/speed1.png',
        preview: false,
      },
      {
        spotId: 8,
        url: 'backend/images/speed/speed2.png',
        preview: false,
      },
      {
        spotId: 8,
        url: 'backend/images/speed/speed3.png',
        preview: false,
      },
      {
        spotId: 8,
        url: 'backend/images/speed/speed4.png',
        preview: false,
      },
      {
        spotId: 9,
        url: 'backend/images/bearded/bD.png',
        preview: true,
      },
      {
        spotId: 9,
        url: 'backend/images/bearded/bD1.png',
        preview: false,
      },
      {
        spotId: 9,
        url: 'backend/images/bearded/bD2.png',
        preview: false,
      },
      {
        spotId: 9,
        url: 'backend/images/bearded/bD3.png',
        preview: false,
      },
      {
        spotId: 9,
        url: 'backend/images/bearded/bD4.png',
        preview: false,
      },
      {
        spotId: 10,
        url: 'backend/images/casle/castleFront.png',
        preview: true,
      },
      {
        spotId: 10,
        url: 'backend/images/casle/casle1.png',
        preview: false,
      },
      {
        spotId: 10,
        url: 'backend/images/casle/casle2.png',
        preview: false,
      },
      {
        spotId: 10,
        url: 'backend/images/casle/casle3.png',
        preview: false,
      },
      {
        spotId: 10,
        url: 'backend/images/casle/casle4.png',
        preview: false,
      },
    ], options, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};

