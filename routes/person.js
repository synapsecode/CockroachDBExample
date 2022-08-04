const router = require('express').Router();
const {Device, Person} = require('../database');

router.get('/:name/devices', async (req, res) => {
    const name = req.params.name;
    await Person.sync();
    const person = await Person.findOne({where:{name:name}}); //Read
    if(person === null) res.send('NOPERSON');
    const devices = await Device.findAll({where: {personId: person.id}})
    res.send({
        person: person.name,
        devices: devices.map((x)=>x.name)
    });
})

router.get('/list', async (req, res) => {
    await Person.sync();
    const people = await Person.findAll(); //Read
    res.send({
        people: people,
        count: people.length
    });
})

router.get('/add/:name', async (req, res) => {
    const name = req.params.name;
    await Person.sync();
    const already_exists = (await Person.findAll()).map((x) => x.name).includes(name);
    if (already_exists) {
        res.send('Person with this name already exists');
        return;
    }
    await Person.create({ name: name }).catch((err) => { res.send(err.message) }); //Create
    res.send('Person crearted with name: ' + name);
})

router.get('/del/:id', async (req, res) => {
    const id = req.params.id;
    await Person.sync();
    await Person.destroy({ where: { id: id } }).catch((err) => res.send(err.message)); //Delete
    res.send('Successfully Destroyed Person!');
})

router.get('/drop', async (req, res) => {
    await Person.drop(); //TableDrop
    res.send('Database Dropped!');
})

router.get('/edit/:name/:newname', async (req, res) => {
    const name = req.params.name;
    const newname = req.params.newname;
    await Person.sync();
    const person = await Person.findOne({ where: { name: name } })
    if (person === null) res.send('NOTFOUND')
    await person.update({ name: newname }).catch((err) => res.send(err.message)); //Update
    res.send(person);
})

module.exports = router;