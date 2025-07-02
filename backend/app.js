const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware’ler
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
const likeRoutes = require('./routes/likeRoutes');
app.use('/api/likes', likeRoutes);
const commentRoutes = require('./routes/commentRoutes');
app.use('/api/comments', commentRoutes);
const tagRoutes = require('./routes/tagRoutes');
app.use('/api/tags', tagRoutes);

app.use('/uploads', express.static('uploads'));



app.get('/', (req, res) => {
  res.send('API çalışıyor...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
});
