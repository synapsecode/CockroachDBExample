const router = require('express').Router();
const { Device, Person, ContactInfo } = require('../database');

// ======================== [ Top Level Routes ] ========================

//List[Read] all the People in the database
router.get('/list', async (req, res) => {
    await Person.sync();
    const people = await Person.findAll(); // [Read]
    res.send({
        people: people,
        count: people.length
    });
})

//[Create] Person using name & phone number
router.get('/add/:name/:phone', async (req, res) => {
    const name = req.params.name;
    const phone = req.params.phone;
    await Person.sync();
    const already_exists = (await Person.findAll()).map((x) => x.name).includes(name);
    if (already_exists) {
        res.send('Person with this name already exists');
        return;
    }
    if (phone === undefined || phone === null) {
        res.send('Enter Phone Number also')
        return;
    }
    const person = await Person.create({ name: name }).catch((err) => { res.send(err.message) }); //Create
    await person.createContact({ phone: phone });
    res.send('Person crearted with name: ' + name + ' and phone number => ' + phone);
})

//Deletes a user using their name
router.get('/del/:name', async (req, res) => {
    const name = req.params.name;
    await Person.sync();
    await Person.destroy({ where: { name: name } }).catch((err) => res.send(err.message)); //Delete
    res.send('Successfully Destroyed ' + name + '!');
})

//Drops the entire table
router.get('/drop', async (req, res) => {
    await Person.drop();
    res.send('Database Dropped!');
})

// ================== [ /:name subroutes ] =================

//Returns all information about a person
router.get('/:name/details', async (req, res) => {
    const name = req.params.name;
    await Person.sync();
    const person = await Person.findOne({where:{name:name}});
    if(person === null){
        res.send('NO-PERSON-FOUND');
        return;
    }
    res.send({
        name: name,
        phone: (await person.getContact()).phone,
        devices: (await person.getDevices()).map(x => x.name),
        following: (await person.getFollowers()).map(x => x.name),
        followers: (await person.getFollowing()).map(x => x.name),
    })
})

//[Update] update the name of the person
router.get('/:name/edit/:newname', async (req, res) => {
    const name = req.params.name;
    const newname = req.params.newname;
    await Person.sync();
    const person = await Person.findOne({ where: { name: name } })
    if (person === null) res.send('NOTFOUND')
    await person.update({ name: newname }).catch((err) => res.send(err.message)); //Update
    res.send(person);
})

//Used to follow another person (Many->Many demo)
router.get('/:uname1/follow/:uname2', async (req, res) => {
    const uname1 = req.params.uname1;
    const uname2 = req.params.uname2;
    await Person.sync();
    const user1 = await Person.findOne({ where: { name: uname1 } });
    const user2 = await Person.findOne({ where: { name: uname2 } });
    if (user1 === null || user2 === null) {
        res.send('NOPERSON');
        return;
    }
    await user1.addFollower(user2);
    res.send(user1.name + " now follows " + user2.name);
})

//Used to unfollow another person (Many->Many demo)
router.get('/:uname1/unfollow/:uname2', async (req, res) => {
    const uname1 = req.params.uname1;
    const uname2 = req.params.uname2;
    await Person.sync();
    const user1 = await Person.findOne({ where: { name: uname1 } });
    const user2 = await Person.findOne({ where: { name: uname2 } });
    if (user1 === null || user2 === null) {
        res.send('NOPERSON');
        return;
    }
    if(!(await user1.hasFollowers(user2))){
        res.send(user1.name + ' does not follow ' + user2.name)
        return;
    }
    await user1.removeFollowers(user2);
    res.send(user1.name + ' unfollowed ' + user2.name)
})

//Used to remove a follower person (Many->Many demo)
router.get('/:uname1/remove_follower/:uname2', async (req, res) => {
    const uname1 = req.params.uname1;
    const uname2 = req.params.uname2;
    await Person.sync();
    const user1 = await Person.findOne({ where: { name: uname1 } });
    const user2 = await Person.findOne({ where: { name: uname2 } });
    if (user1 === null || user2 === null) {
        res.send('NOPERSON');
        return;
    }
    if(!(await user1.hasFollowing(user2))){
        res.send(user2.name + 'does not follow ' + user1.name)
        return;
    }
    await user1.removeFollowing(user2);
    res.send(user2.name + ' removed from  ' + user1.name + "'s follower list")
})

//Used to add devices to a person's collection
router.get('/:owner/add_device/:device_name', async (req, res) => {
    const owner = req.params.owner;
    const device_name = req.params.device_name;
    await Person.sync();
    const person = await Person.findOne({ where: { name: owner } });
    if (person === null) {
        res.send('NOPERSON');
        return;
    }
    const device = await person.createDevice({ name: device_name });
    res.send('Device crearted with name: ' + device.name + ' for owner: ' + person.name);
})

module.exports = router;