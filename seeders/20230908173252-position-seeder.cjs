'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Positions', [
        {
            name: 'Security',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Designer',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Content manager',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Lawyer',
            createdAt: new Date(),
            updatedAt: new Date()
        }

    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Positions', null, {});
  }
};
