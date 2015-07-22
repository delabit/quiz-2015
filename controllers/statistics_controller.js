var models = require('../models/models');

exports.show = function(req, res){
	models.Quiz.findAll({include: [models.Comment]}).then(function(quizes){
		var stats = {
			nQuizes: quizes.length,
			nQuizesComment: 0, 
			nQuizesNoComment: 0,
			nComments: 0,
			medComments: 0.0
		};
		for(i in quizes){
			if(quizes[i].Comments.length === 0){
				stats.nQuizesNoComment += 1;
			}else{
				stats.nQuizesComment += 1;
			}
			stats.nComments += quizes[i].Comments.length;
		}
		stats.medComments = (stats.nComments / stats.nQuizes).toFixed(2);
		res.render('statistics', {stats: stats, errors: []});
	}).catch(function(error){next(error);});	
};

