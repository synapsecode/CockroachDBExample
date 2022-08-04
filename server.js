//Imports
const express = require('express')
const bodyParser = require('body-parser')
const { Sequelize } = require("sequelize-cockroachdb");
const fs = require('fs');

//Declarations
const app = express()
const CONN_STR = fs.readFileSync('connstring.txt', 'utf8');
const sequelize = new Sequelize(CONN_STR);

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//Creating the Model
const People = sequelize.define('people', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.TEXT
  }
})

//Routes
app.get('/', (req, res, next) => {
  res.send('MicrobloggerAPI')
}) 

app.get('/user/list', async (req, res)=> {
  await People.sync();
  const people = await People.findAll(); //Read
  res.send({
    people: people,
    count: people.length
  });
})

app.get('/user/add/:name', async (req, res) => {
  const name = req.params.name;
  await People.sync();
  const already_exists = (await People.findAll()).map((x)=>x.name).includes(name);
  if(already_exists){
    res.send('Person with this name already exists');
    return;
  }
  await People.create({name: name}).catch((err)=>{res.send(err.message)}); //Create
  res.send('Person crearted with name: ' + name);
})

app.get('/user/del/:id', async (req, res)=>{
  const id = req.params.id;
  await People.sync();
  await People.destroy({where: {id:id}}).catch((err)=>res.send(err.message)); //Delete
  res.send('Successfully Destroyed ID!');
})

app.get('/user/drop', async (req, res)=>{
  await People.drop(); //TableDrop
  res.send('Database Dropped!');
})

app.get('/user/edit/:name/:newname', async (req, res) => {
  const name = req.params.name;
  const newname = req.params.newname;
  await People.sync();
  const person = await People.findOne({where: {name: name}})
  if(person === null) res.send('NOTFOUND')
  await person.update({name: newname}).catch((err)=>res.send(err.message)); //Update
  res.send(person);
})

app.listen(3000, () => {
  console.log(`CockroachDBExample listening on port 3000`)
})
