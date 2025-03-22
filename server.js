const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connection successful!');
  } catch (err) {
    console.error('DB connection error:', err.message || err);
    process.exit(1);
  }
};
connectDB();


const port = process.env.PORT || 3000;
console.log(process.env.PORT);
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDELED REJECTIONS! Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});