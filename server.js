//importing all the required services 
const express = require('express');
const mongo = require('mongodb').MongoClient;
const db = require('./config/config');
const port = process.env.PORT || 8000;
const app = express();
const body=require('body-parser');
const cors=require('cors');
app.use(express.urlencoded({extended:true}));
app.use(body.urlencoded({ extended: false }));
app.use(body.json());
app.use(express.json());
app.use(body());
app.use(cors());

//connecting the mongodb with server
mongo.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
    if (err)
        return console.log(err);
    const database = db.db("UserData")
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('Server is ready');
    });
})

