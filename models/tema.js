// Tabla de las preguntas en BD

module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Tema',
		{
			valor: { type: DataTypes.STRING },
			etiqueta: { type: DataTypes.STRING }
		}
	);
}