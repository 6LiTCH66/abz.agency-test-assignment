'use strict';

const faker = require('faker');

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {

    const demoUsers = [];
    const positions = ["Security", "Designer", "Content manager", "Lawyer"];

    for (let i = 0; i < 47; i++) {
      const positionIndex = faker.datatype.number({ min: 0, max: positions.length - 1 });

      demoUsers.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber('+380#########'),
        position: positions[positionIndex],
        position_id: positionIndex + 1,
        photo: `https://frontend-test-assignment-api.abz.agency/images/users/${faker.random.uuid()}.jpeg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Users', demoUsers, {});


  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
