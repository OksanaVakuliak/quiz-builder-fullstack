const express = require('express');
const quizRoutes = require('./quiz.routes');

const router = express.Router();

router.use('/quizzes', quizRoutes);

module.exports = router;
