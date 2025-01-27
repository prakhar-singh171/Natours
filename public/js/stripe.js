/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51QXzqYG2bh3UxEZ2gdS2YzmP9FAWjE1RAOjZ9jjpJt72cpWRUIiBUgpnOqlHbcFvgmFP3EFnX7SlrWzmM2mWO3z500BZCiPzBs');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};