const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

//mongodb connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connection established successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const userRouter = require('./routes/user');

app.use("/user", userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});