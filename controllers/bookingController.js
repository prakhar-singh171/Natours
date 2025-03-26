const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError('Tour not found', 404));

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.FRONTEND_URL}/verify-payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${process.env.BACKEND_URL}/img/tours/${tour.imageCover}`], // Updated for consistency
          },
          unit_amount: tour.price * 100, // Convert price to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });

  // Send session response
  res.status(200).json({ status: 'success', session });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  console.log('--------------------------------');
  console.log('--------------------------------');
  console.log('--------------------------------');

  const { sessionId } = req.body;
  console.log('dfsdfsdfsdfsfsdfsdfsdfds', req.body);

  if (!sessionId) {
      return res.status(400).json({ status: "fail", message: "Missing session ID" });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log(session.payment_status === 'paid');

  if (session.payment_status === 'paid') {
      console.log('tttttt1', session.customer_email, session.client_reference_id, session.amount_total);
      
      try {
          const user = await User.findOne({ email: session.customer_email });

          // ✅ CHECK IF BOOKING ALREADY EXISTS
          const existingBooking = await Booking.findOne({
              tour: session.client_reference_id,
              user: user._id
          });

          if (existingBooking) {
              console.log("⚠️ Booking already exists, skipping duplicate.");
              return res.status(200).json({ status: "success", data: existingBooking });
          }

          // ✅ CREATE BOOKING ONLY IF IT DOESN'T EXIST
          const booking = await Booking.create({
              tour: session.client_reference_id,
              user: user._id,
              price: session.amount_total / 100,
          });

          console.log("✅ Booking Created:", booking);
          return res.status(200).json({ status: "success", data: booking });
      } catch (dbError) {
          console.error("❌ Database Error:", dbError);
          return res.status(500).json({ status: "error", message: "Database error", error: dbError.message });
      }
  } else {
      console.log('tttttt');
      return res.status(400).json({ status: "fail", message: "Payment not completed" });
  }
});



  

  exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
    const { tour, user, price } = req.query;
  
    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });
  
    res.redirect(req.originalUrl.split('?')[0]);
  });

  exports.getMyBookings = catchAsync(async (req, res, next) => {
    console.log('-----------------------')
    console.log('-----------------------')
    console.log('-----------------------')

    const userId = req.user.id; // Assuming authentication middleware sets req.user
    console.log(userId);
    const bookings = await Booking.find({ user: userId })
    .populate({
        path: 'tour',
        select: 'name imageCover' // ✅ Explicitly select `imageCover`
    }); 
    console.log(bookings); 
    if (!bookings.length) {
      return next(new AppError('No bookings found for this user', 404));
    }
  
    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        data: bookings
      }
    });
  });
  

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);