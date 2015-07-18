var path = require('path');

//Postgres => postgres://user:password@host:port/database
//SQLite => sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= url[6] || null;
var user 		= url[2] || null;
var pwd 		= url[3] || null;
var protocol 	= url[1] || null;
var dialect 	= url[1] || null;
var port 		= url[5] || null;
var host 		= url[4] || null;
var storage		= process.env.DATABASE_STORAGE;

// ORM
var Sequelize = require('sequelize');
// SQLite o Postgres
var sequelize = new Sequelize(
	DB_name, 
	user, 
	pwd, 
	{
		dialect: protocol,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, 	// Para SQLite (archivo .env)
		omitNull: true 		// Para Postgres

	}
);
// Tabla Quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'))
// Tabla Tema
var Tema = sequelize.import(path.join(__dirname,'tema'));
// Tabla Comments
var Comment = sequelize.import(path.join(__dirname,'comment'));

//Relaciones entre tablas
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//Exportamos tablas
exports.Quiz = Quiz;
exports.Tema = Tema;
exports.Comment = Comment;

// Inicializamos bases de datos si está vacía
sequelize.sync().success(function(){
	Quiz.count().success(function(count){
		if(count === 0){
			Quiz.create({
				pregunta: 'Capital de Italia', 
				respuesta: 'Roma',
				tema: 'otro'
			});			
			Quiz.create({
				pregunta: 'Capital de Portugal', 
				respuesta: 'Lisboa',
				tema: 'otro'
			}).success(function(){console.log('Tabla *Quiz* creada')});
		}
	});
	Tema.count().success(function(count){
		if(count === 0){
			Tema.create({valor: 'otro', etiqueta: 'Otro'});
			Tema.create({valor: 'humanidades', etiqueta: 'Humanidades'});
			Tema.create({valor: 'ocio', etiqueta: 'Ocio'});
			Tema.create({valor: 'ciencia', etiqueta: 'Ciencia'});
			Tema.create({valor: 'tecnologia', etiqueta: 'Tecnología'})
			.success(function(){console.log('Tabla *Tema* creada\nBase de datos inicializada')});
		}
	});	
});
