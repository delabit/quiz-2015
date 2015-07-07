var path = require('path');

// ORM
var Sequelize = require('sequelize');
// SQLite
var sequelize = new Sequelize(null, null, null, {dialect: 'sqlite',storage: 'quiz.sqlite'})
// Tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'))
// Hacemos la tabla accesible
exports.Quiz = Quiz;

sequelize.sync().success(function(){
	Quiz.count().success(function(count){
		if(count === 0){
			Quiz.create({
				pregunta: 'Capital de Italia', 
				respuesta: 'Roma'
			}).success(function(){console.log('Base de datos inicializada')});
		}
	});
});