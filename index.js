/* eslint-disable func-names */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

//middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// static
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  cors({
    credentials: false,
    origin: ['http://localhost:3003', 'http://localhost:8001', 'http://localhost:3000'],
  }),
);
//routes
app.use(require('./src/routes'))

app.listen(process.env.PORT || 3000, () => {
  console.log('listening on 3000');
});
