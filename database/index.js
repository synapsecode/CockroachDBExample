const { Sequelize } = require("sequelize-cockroachdb");
const fs = require('fs');

//DatabaseCreation
const CONN_STR = fs.readFileSync('connstring.txt', 'utf8');
const sequelize = new Sequelize(CONN_STR, { logging: true });

//Import DBModels
const Person = require('./person_schema')(sequelize, Sequelize);
const Device = require('./device_schema')(sequelize, Sequelize);
const ContactInfo = require('./contact_schema')(sequelize, Sequelize);

//Implement Relationships
// ====== [ One->Many ] =====
Person.hasMany(Device);
Device.belongsTo(Person);

// ===== [ One->One ] =====
Person.hasOne(ContactInfo);
ContactInfo.belongsTo(Person)

// ===== [ Many->Many ] =====
Person.belongsToMany(Person, {
    through: 'Person_Follow',
    as: 'followers',
    foreignKey: 'follower_id',
    otherKey: 'following_id'
})
Person.belongsToMany(Person, {
    through: 'Person_Follow',
    as: 'following',
    foreignKey: 'following_id',
    otherKey: 'follower_id'
})

//Export all your DBModels using this to make them accessible anywhere in the program
module.exports = {
    Sequelize,
    sequelize,
    Person,
    Device,
    ContactInfo
};