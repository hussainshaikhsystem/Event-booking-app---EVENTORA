const dotenv = require('dotenv');
dotenv.config();   // ✅ sabse pehle chalna chahiye

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT ;
const connectdb = require('./config/db.js');
const authroutes = require('./routes/authroutes.js');   // ✅ ab jab ye load hoga, env variables ready honge
const eventroutes = require('./routes/eventroutes.js');   // ✅ ab jab ye load hoga, env variables ready honge
const bookingsroutes = require('./routes/bookingsroutes.js');   // ✅ ab jab ye load hoga, env variables ready honge

app.use(cors());
app.use(express.json());

connectdb();
app.use('/api/auth', authroutes);
app.use('/api/events', eventroutes);
app.use('/api/bookings', bookingsroutes);
if(!process.env.VERCEL){
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
}
module.exports = app;