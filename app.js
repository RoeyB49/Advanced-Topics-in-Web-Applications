require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database/db');
// const postRoutes = require('./routes/postRoutes');
// const commentRoutes = require('./routes/commentRoutes');

const app = express();

connectDB();

app.use(bodyParser.json());

// app.use('/posts', postRoutes);
// app.use('/comments', commentRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
