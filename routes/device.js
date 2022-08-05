const router = require('express').Router();
const {Device} = require('../database');

// ======================== [ Top Level Routes ] ========================

//Lists all the devices present in the database
router.get('/list', async (req, res) => {
    await Device.sync();
    const devices = await Device.findAll();
    res.send({
        devices: devices,
        count: devices.length
    });
})

//Deletes the specified device by name
router.get('/del/:name', async (req, res) => {
    const name = req.params.name;
    await Device.sync();
    await Device.destroy({ where: { name: name } }); //Delete
    res.send('Successfully Destroyed Device!');
})

//Drops the whole table
router.get('/drop', async (req, res) => {
    await Device.drop();
    res.send('Database Dropped!');
})

// =============== [Device Specific Routes] ===================

//Finds an individual device by name
router.get('/:name/details', async (req, res) => {
    await Device.sync();
    const name = req.params.name;
    const device = await Device.findOne({ where: { name: name } });
    res.send({
        'name': device.name,
        'owner': await device.getPerson(),
    });
})

//[Update] the name of the specified device
router.get('/:name/edit/:newname', async (req, res) => {
    const name = req.params.name;
    const newname = req.params.newname;
    await Device.sync();
    const device = await Device.findOne({ where: { name: name } })
    if (device === null) res.send('NOTFOUND')
    await device.update({ name: newname });
    res.send(device);
})

module.exports = router;