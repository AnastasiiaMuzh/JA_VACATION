// seeder for user
"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    
    await User.bulkCreate(
      [
        {
          firstName: "Freddy",
          lastName: "Muzh",
          email: "freddy@user.io",
          username: "freddyTheDragon1",
          hashedPassword: bcrypt.hashSync("UnleashTheDragon777#*"),
        },
        {
          firstName: "Bartholomeow",
          lastName: "Allen",
          email: "bartholomeow@user.io",
          username: "impulseFlash3",
          hashedPassword: bcrypt.hashSync("ZoomMustDie333*#"),
        },
        {
          firstName: "Anastasiia",
          lastName: "Muzh",
          email: "nastya_moose@user.io",
          username: "NazzieMoose7",
          hashedPassword: bcrypt.hashSync("MashaAnekaMila137***"),
        },
        {
          firstName: "Barry",
          lastName: "Allen",
          email: "barry_bee@user.io",
          username: "BarryBee23",
          hashedPassword: bcrypt.hashSync("BuzzOff13#*"),
        },
        {
          firstName: "Johnny",
          lastName: "P",
          email: "johnny_p@user.io",
          username: "JohnnyPeace12",
          hashedPassword: bcrypt.hashSync("PeaceLove&Chicken1324***"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "freddyTheDragon1",
            "impulseFlash3",
            "NazzieMoose7",
            "BarryBee23",
            "JohnnyPeace12",
          ],
        },
      },{});
  },
};