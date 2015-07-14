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

// Carga de temas
exports.loadTemas = function(req, res, next){
	models.Tema.findAll().then(function(temas){
		req.temas = temas;
		next();
	});
};

// GET /quizes
exports.index = function(req, res){
	var filtro = {}
	if(req.query.search){
		req.query.search = '%' + req.query.search.replace(/ /g,'%') + '%';
		filtro = {where: ["pregunta like ?", req.query.search]};
	}

	models.Quiz.findAll(filtro).then(function(quizes){
		res.render('quizes/index.ejs',{quizes: quizes, errors: []});
	}).catch(function(error){next(error);});
};

// GET /quizes/:quizId
exports.show = function(req,res){
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function(req,res){
	if(req.query.respuesta === req.quiz.respuesta)
		res.render('quizes/answer', {quiz: req.quiz, repuesta: 'Correcto', errors: []});
	else
		res.render('quizes/answer', {quiz: req.quiz, repuesta: 'Incorrecto', errors: []});		
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build({pregunta: '', respuesta: '', tema: ''});
	res.render('quizes/new',{quiz: quiz, temas: req.temas, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build(req.body.quiz);
	// Validamos los datos
	quiz.validate().then(function(err){
		if(err){
			// Muestra error
			console.log(quiz);
			res.render('quizes/new',{quiz: quiz, errors: err.errors});
		}else{
			// Guardamos en BD
			quiz
			.save({fields: ["pregunta","respuesta","tema"]})
			.then(function(){res.redirect('/quizes');});
		}
	});
};

// POST /quizes/:quizId/edit
exports.edit = function(req, res){
	var quiz = req.quiz; //autoload (1º Middelware)
	res.render('quizes/edit', {quiz: quiz, temas: req.temas, errors: []}); 
};

// PUT /quizes/:quizId
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err){
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		}else{
			req.quiz
			.save({fields: ["pregunta","respuesta","tema"]})
			.then(function(){res.redirect('/quizes');});
		}
	});
};

//DELETE /quixes/:quizId
exports.destroy = function(req, res){
	req.quiz
	.destroy()
	.then(function(){
		res.redirect('/quizes')
	}).catch(function(error){next(error)});
};