var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

// Autoload de rutas con quizId
router.param('quizId',						quizController.load);
// Autolad temas
router.get('/quizes/new', 					quizController.loadTemas);
router.get('/quizes/:quizId(\\d+)/edit',	quizController.loadTemas);

/* Quizes */
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new', 					quizController.new);
router.post('/quizes/create', 				quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	quizController.edit);
router.put('/quizes/:quizId(\\d+)',		 	quizController.update);
router.delete('/quizes/:quizId(\\d+)',		quizController.destroy);

/* Authors page */
router.get('/author', function(req, res){
	res.render(
		'author',
		{
			webDesigner: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
			developer: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
			databaseManager: {nombre: 'Rafael de la Piñera Vázquez', foto: '/images/rafa.jpg'},
			errors: []
		}
	);
});

module.exports = router;
