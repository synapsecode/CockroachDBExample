const { Sequelize } = require("sequelize-cockroachdb");
const fs = require('fs');

//DatabaseCreation
const CONN_STR = fs.readFileSync('connstring.txt', 'utf8');
const sequelize = new Sequelize(CONN_STR);

//Import DBModels
const Person = require('./person')(sequelize, Sequelize);
const Device = require('./device')(sequelize, Sequelize);

//Implement Relationships
Person.hasMany(Device);

//Export all your DBModels using this to make them accessible anywhere in the program
module.exports = { Sequelize, sequelize, Person, Device};