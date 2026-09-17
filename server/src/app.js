const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute =  require('./routes/auth.routes');

const app =  express();

app.use(cors({

    origin : process.env.CLIENT_URL || 'http://localhost:5173' ,
    credentials : true,
}));

app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cookieParser());


app.use('/api/auth', authRoute);

app.get('/health', (req,res) => {

    res.status(200).json({
        status : "ok",
        timestamp : new Date().toISOString(),
        service : 'Com.ly Backedn API'
    });
});

module.exports = app;