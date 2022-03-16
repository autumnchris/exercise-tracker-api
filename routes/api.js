const express = require('express');
const userController = require('../controllers/user-controller');
const exerciseController = require('../controllers/exercise-controller');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/user/new', (req, res, next) => {
  res.render('user-form');
});

router.post('/user/new', userController.createUser);

router.get('/exercise/new', (req, res, next) => {
  res.render('exercise-form');
});

router.post('/exercise/new', exerciseController.addExercise);

router.get('/users', userController.fetchUsers);

router.get('/user/log/:userid', userController.fetchUserLog);

module.exports = router;
