var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* Quizes */
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/* Authors page */
router.get('/author', function(req, res){
	res.render('author',{
		webDesigner: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
		developer: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
		databaseManager: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
	});
});

module.exports = router;
