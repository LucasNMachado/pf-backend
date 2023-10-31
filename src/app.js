// imports
import express from 'express'
import displayRoutes from 'express-routemap';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';

const app = express();
const PORT = process.env.PORT || 8080;


// endpoints
app.get('/',(req,res) =>{
    res.send('Hola bro')
})

// servidor
const serverHttp = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Server is running on port ${PORT}`); });
    
// cfg express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));