"use strict";

const saltRounds = 10;

const hashPassword = (password) => {
  const bcrypt = require('bcrypt');
  return bcrypt.hashSync(password, saltRounds);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    // Delete existing admin with the same email
    await queryInterface.bulkDelete("Users", { email: "admin@gmail.com" }, {});
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Super",
          lastName: "Admin",
          email: "admin@gmail.com",
          password: hashPassword('admin123'), // Now using bcrypt hash
          role: "admin", // Set role to admin
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          firstName: "Regular",
          lastName: "User",
          email: "user@gmail.com",
          password: hashPassword("user123"), // Now using bcrypt hash
          role: "user", // Set role to user
          created_at: new Date(),
          updated_at: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
}; 