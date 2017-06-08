var express = require('express');
var cons = require('consolidate');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var app = express();

app.engine('html', cons.pug);
app.set('view engine', 'html');
app.set('views',  __dirname +  '/views')
app.use(bodyParser())

// Récupération du client mongodb
var mongoClient = require('mongodb').MongoClient;

// Paramètres de connexion
var url = 'mongodb://localhost:27017/dbtasks';

//Affiche les tâches
app.get('/tasks', function(req, res) {
	app.db.collection('dbtasks').find({}).toArray(function(err, tasks) {
		res.render("tasks", {
			'tasklist' : tasks
		});
	});
});

//Ajoute une tâche
app.post('/tasks/new', function(req, res) {
	var nom = req.body.nom;
	var date = req.body.date;
	var labels = req.body.labels.split(",");

	app.db.collection('dbtasks').insert({'nom' : nom, 'date' : date, 'labels' : labels});

	res.redirect('/tasks');
});

//Supprime une tâche
// TODO : à améliorer
app.post('/tasks/delete/:id', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);

	app.db.collection('dbtasks').remove({_id : id});

	res.redirect('/tasks');
});

//Affiche une tâche
app.get('/tasks/:id', function(req, res) {
	var id = new mongodb.ObjectId(req.params.id);
	
	app.db.collection('dbtasks').find({_id : id}).toArray(function(err, tasks) {
		res.render("task", {'tasklist' : tasks});
	});
});

//Modifie une tâche
// TODO : à implémenter
app.post('/tasks/:id/edit', function(req, res) {

	res.redirect('/tasks');
});
	
// Connexion au serveur avec la méthode connect
mongoClient.connect(url, function (err, db) {
	app.db = db;
	app.listen(8000);
	console.log("Express server started on 8000");
});