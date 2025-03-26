const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const cors=require('cors')
app.use(cors({
  origin: 'http://localhost:5173', // Allow Vite development server
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Specify allowed methods
}));
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});
app.use('/api/v1/img/tours',(req, res, next) => {
  const resolvedPath = path.join(__dirname, 'public/img/tours', req.path);
  console.log('Resolved static file path:', resolvedPath);
  next();
},express.static(path.join(__dirname, 'public/img/tours')));


// 1) GLOBAL MIDDLEWARES
// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/img/users', express.static(path.join(__dirname, 'public/img/users')));

// Set security HTTP headers
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://tile.openstreetmap.org",
            "https://a.tile.openstreetmap.org",
            "https://b.tile.openstreetmap.org",
            "https://c.tile.openstreetmap.org",
            "https://unpkg.com", // If required
          ],
        scriptSrc: [
          "'self'", 
          "https://js.stripe.com",
          "https://cdn.jsdelivr.net", // Existing source
          "https://unpkg.com",
          "'unsafe-eval'",
          //  // Allow unpkg as a source for Leaflet
        ],
        frameSrc: [
          "'self'", 
          "https://js.stripe.com", // Allow Stripe to be framed
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
        
          connectSrc: [
            "'self'", 
            "ws://127.0.0.1:1234", // Allow WebSocket connection
           "https://tile.openstreetmap.org", // Other allowed connections
          ]
         
        // Other directives...
      },
    })
  );
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES

 app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
