'use strict';

let bodyParser = require('body-parser');

let express = require('express');
let controller = express();

let taskService = require('./modules/task.service');


const utils = require('./modules/utils');

controller.use(bodyParser.json());

controller.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

controller.get('/api/tasks', async function (req, res) {
	let tasks = await taskService.findAll();
	for (let task of tasks) {
		task.duedate = utils.toISO8601DateTime(task.duedate);
	}
	res.send(tasks);
});


controller.post('/api/tasks', async function (req, res) {
	let task = req.body;
	let savedTask = await taskService.save(task);
	if (savedTask) {
		res.setHeader('Location', `http://localhost:3000/api/tasks/${savedTask.id}`);
		res.status(201).send(savedTask);
	} else {
		// error, we did NOT find a task 
		// so render the common 404 (Not found)
		res.status(404).end();
	}
});

controller.get('/api/tasks/:id', async function (req, res) {
	let id = +req.params.id
	let task = await taskService.findById(id);
	// OK we found one
	if (task) {
		task.duedate = utils.toISO8601DateTime(task.duedate);

		//response successful end with a string of the found row
		res.send(task);
	} else {
		// error, we did NOT find one
		// so render the common 404 (Not found)
		res.status(404).end();
	}
});


controller.put('/api/tasks/:id', async function (req, res) {
	// First read id from params
	let id = +req.params.id
	let inputTask = req.body;
	let updatedTask = await taskService.updateById(id, inputTask);
	if (updatedTask) {
		res.send(updatedTask);
	} else {
		res.status(404).end();
	}
});




controller.delete('/api/tasks/:id', async function (req, res) {
	let id = +req.params.id;
	 try {
		let result = await taskService.deleteById(id);
		if (result) {
			res.status(204).end();// true hence the deletion succeeded
		}
		else {
			res.status(404).end();// false hence the deletion failed (non existing)
		}
	}
	catch (error) {
		res.status(412).end();// false hence the deletion failed because of constraints
	}
});


controller.use(express.static('public/ui'));

// set correct time zone
process.env.TZ='Europe/Amsterdam';

// and finally ... run the server :-)
let server = controller.listen(3000, function () {
	console.log('jhipster_jdl app listening at http://%s:%s', server.address().address, server.address().port)
});

