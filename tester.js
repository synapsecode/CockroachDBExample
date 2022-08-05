const { sequelize, Person, Device } = require('./database');

Person.hasMany(Device);

(async () => {
    await sequelize.sync();
    console.log('\n\n\n\n\n\n\n\n\nSYNC DONE');
    const person = await Person.create({ name: 'Satish Reddy' });
    const device = await person.createDevice({ name: 'iPhone 13' });
    console.log('\n\n\n\n\n\n\n\n\nCREATION DONE');
    console.log('Person: ', await Person.findOne({ where: { name: person.name } }));
    console.log('Devices: ', await Device.findAll({ where: { personId: person.id } }));
})();

/*
URLS FOR TESTING

DATA ADDITION
http://localhost:3000/person/add/Manas/001
http://localhost:3000/person/add/Veeksha/002
http://localhost:3000/person/add/Siri/003
http://localhost:3000/person/add/Srishti/004
http://localhost:3000/person/Manas/add_device/iPhone11
http://localhost:3000/person/Manas/add_device/mac
http://localhost:3000/person/Veeksha/add_device/Samsung
http://localhost:3000/person/Manas/follow/Veeksha
http://localhost:3000/person/Manas/follow/Siri
http://localhost:3000/person/Manas/follow/Srishti
http://localhost:3000/person/Siri/follow/Veeksha
http://localhost:3000/person/Siri/follow/Srishti
http://localhost:3000/person/Siri/follow/Manas
http://localhost:3000/person/Veeksha/follow/Manas
http://localhost:3000/person/Veeksha/follow/Siri
http://localhost:3000/person/Srishti/follow/Siri


CHECKING
localhost:3000/person/list
localhost:3000/person/Manas/details
*/