const router = require('express').Router();
const {Device, Person} = require('../database');

router.get('/get/:id', async (req, res) => {
    await Device.sync();
    const id = req.params.id;
    const device = await Device.findOne({ where: { id: id } }); //Read
    res.send(device);
})

router.get('/list', async (req, res) => {
    await Device.sync();
    const devices = await Device.findAll(); //Read
    res.send({
        devices: devices,
        count: devices.length
    });
})

router.get('/add/:name/:owner', async (req, res) => {
    const name = req.params.name;
    const owner = req.params.owner;
    await Person.sync();
    const person = await Person.findOne({ where: { name: owner } });
    if (person === null) {
        res.send('NOPERSON');
        return;
    }
    const device = await person.createDevice({ name: name });
    res.send('Device crearted with name: ' + device.name + ' for owner: ' + person.name);
})

router.get('/del/:id', async (req, res) => {
    const id = req.params.id;
    await Device.sync();
    await Device.destroy({ where: { id: id } }).catch((err) => res.send(err.message)); //Delete
    res.send('Successfully Destroyed Device!');
})

router.get('/drop', async (req, res) => {
    await Device.drop(); //TableDrop
    res.send('Database Dropped!');
})

router.get('/edit/:name/:newname', async (req, res) => {
    const name = req.params.name;
    const newname = req.params.newname;
    await Device.sync();
    const device = await Device.findOne({ where: { name: name } })
    if (device === null) res.send('NOTFOUND')
    await device.update({ name: newname }).catch((err) => res.send(err.message)); //Update
    res.send(device);
})

module.exports = router;