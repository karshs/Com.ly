const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoute =  require('./routes/auth.routes');
const linkRoutes = require('./routes/link.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const bioRoutes = require('./routes/bio.routes'); 


const {
  authLimiter,
  linkCreateLimiter,
  redirectLimiter,
} = require('./middleware/rateLimiter.middleware');

const { redirectLink } = require('./controllers/link.controller');

const app =  express();

app.use(cors({

    origin : process.env.CLIENT_URL || 'http://localhost:5173' ,
    credentials : true,
}));

app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cookieParser());

app.get('/r/:shortCode', redirectLimiter, redirectLink);

app.use('/api/auth',authLimiter, authRoute);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bio', bioRoutes);


app.get('/health', (req,res) => {

    res.status(200).json({
        status : "ok",
        timestamp : new Date().toISOString(),
        service : 'Com.ly Backedn API'
    });
});


app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      code: 'NOT_FOUND',
    },
  });
});


app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || 'An unexpected internal server error occurred',
      code: err.code || 'INTERNAL_SERVER_ERROR',
    },
  });
});

module.exports = app;