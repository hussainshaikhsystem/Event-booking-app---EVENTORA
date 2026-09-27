const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv')
const port = process.env.PORT || 5000;
const connectdb = require('./config/db.js');
const authroutes = require('./routes/authroutes.js')
app.use(cors());
app.use(express.json())
dotenv.config();
connectdb()
app.use('/api/auth', authroutes)
app.listen(port , () => {
    console.log(`Server is running on http://localhost:${port}`);
})