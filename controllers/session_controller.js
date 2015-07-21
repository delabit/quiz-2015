// Users Authentication
exports.loginRequired = function(req, res, next){
	if(req.session.user){
		next();
	}else{
		res.redirect('/login');
	}
};

// GET /login
exports.new = function(req, res){
	var errors = req.session.errors || {};
	res.render('sessions/new', {errors: errors})
};

// POST /login
exports.create = function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(err, user){
		if(err){
			req.session.errors = [{'message': 'Se ha producido un error: ' + err}];
			res.redirect('/login');
			return;
		}
		// Crear session y campos id de usuario y nombre
		req.session.user = {id: user.id, username: user.username};
		// Devolvemos al path anterior (última visita antes de login)
		res.redirect(req.session.redir.toString());
	});
};

// GET /logout
exports.destroy = function(req, res){
	delete req.session.user;
	console.log(req.session.redir.toString());
	res.redirect(req.session.redir.toString()); // Volver al path anterior a login
};