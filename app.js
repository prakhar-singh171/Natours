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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const cors = require('cors');

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:8000', // Allow requests from this origin
    credentials: true, // Allow cookies and other credentials
  })
);

// 1) GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    next();
  });
}


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "ws://localhost:1234"],
        connectSrc: [
          "'self'",
          "ws://127.0.0.1:1234",
          "ws://localhost:1234",
          "ws://127.0.0.1:54817",
          "ws://localhost:57399",
          "https://tile.openstreetmap.org",
        ],
      },
    },
  })
);


// Disable CSP temporarily in development mode for debugging purposes
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    next();
  });
}

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

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
