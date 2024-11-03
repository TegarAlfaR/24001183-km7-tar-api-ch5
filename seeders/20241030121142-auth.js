'use strict';

const bcrypt = require('bcryptjs');
const { User } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = await User.findOne({
      where: { username: 'Super Admin' },
    });

    if (!user) {
      throw new Error('User "Super Admin" tidak ditemukan');
    }

    const hashedPassword = await bcrypt.hash('superadmin@password123', 10); 

    return queryInterface.bulkInsert('Auths', [
      {
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        user_id: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Auths', null, {});
  }
};
