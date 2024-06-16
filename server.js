const express = require('express');
const app = express();
const { connectDB } = require('./config/db');
const initRoute = require('./Routes/index');
const cors = require('cors');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

connectDB();

initRoute(app);

app.listen(process.env.PORT || 8080, () => {
console.log('Server running on port', process.env.PORT || 8080);
})