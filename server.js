//Imports
const express = require('express');
const bodyParser = require('body-parser');
const {personRoutes, deviceRoutes} = require('./routes');
const {sequelize} = require('./database');

//Declarations
const app = express()

//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//RouteDeclarations
app.use('/person', personRoutes);
app.use('/device', deviceRoutes);

//Routes
app.get('/', async (req, res) => {
  res.send('CockroachDBTest');
}) 

app.listen(3000, async () => {
  //Enable this after making new relationships or editing tables
  // await sequelize.sync({ force: true });
  console.log(`\n\n\nCockroachDBExample listening on port 3000`)
});
