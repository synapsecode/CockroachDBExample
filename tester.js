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