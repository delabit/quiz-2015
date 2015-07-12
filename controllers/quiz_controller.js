var models = require('../models/models.js');

// Autoload de rutas con quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(function(quiz){
		if(quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error('No existe quizId=' + quizId))
		}
	}).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res){
	var filtro = {}
	if(req.query.search){
		req.query.search = '%' + req.query.search.replace(/ /g,'%') + '%';
		filtro = {where: ["pregunta like ?", req.query.search]};
	}

	models.Quiz.findAll(filtro).then(function(quizes){
		res.render('quizes/index.ejs',{quizes: quizes});
	}).catch(function(error){next(error);});
};

// GET /quizes/:quizId
exports.show = function(req,res){
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/answer
exports.answer = function(req,res){
	if(req.query.respuesta === req.quiz.respuesta)
		res.render('quizes/answer', {quiz: req.quiz, repuesta: 'Correcto'});
	else
		res.render('quizes/answer', {quiz: req.quiz, repuesta: 'Incorrecto'});		
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build({pregunta: 'Pregunta', respuesta: 'Respuesta'});
	res.render('quizes/new',{quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	//Guardamos en BD
	quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	});
};