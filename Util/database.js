const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'tehv1789$$', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
