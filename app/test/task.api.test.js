'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const request = require('request');
const DateTime = require('luxon').DateTime;

const baseUrl = 'http://localhost:3000/api/tasks';

let id; // for later storing an id in between to tests
let victimId; // for later storing an id in between to tests for deletion

describe('Task API Tests => ', function () {

	it('POST http://localhost:3000/api/tasks should create a task', function (done) {

		let fixture = {
			title: "Mariano Metz", 
			description: "Karrie Lehner DDS", 
			duedate: DateTime.fromObject({day: 18, month: 3, year: 2020, hour:22, minute: 44, seconds: 22}), 
			attachment: "Yetta Lind"
		}

		let options = {
			uri: baseUrl,
			json: fixture
		}
		request.post(options, function (error, response, responseBody) {
			id = responseBody.id;

			expect(response.statusCode).to.be.equal(201);
			expect(response.headers.location).to.be.equal(`${baseUrl}/${id}`);
			expect(responseBody.title).to.equal(fixture.title);
			expect(responseBody.description).to.equal(fixture.description);
			expect(DateTime.fromISO(responseBody.duedate).toLocal().toJSON()).to.be.equal(fixture.duedate.toJSON());
			expect(responseBody.attachment).to.equal(fixture.attachment);
			done();
		});
	});

	it('GET http://localhost:3000/api/tasks should return a list of tasks', function (done) {
		let options = {
			uri: baseUrl,
			json: true
		}
		request.get(options, function (error, response, responseBody) {
			expect(responseBody.length).to.be.greaterThan(0);
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('GET http://localhost:3000/api/tasks/:id should return a task with id: id', function (done) {
		let fixture = {
			title: "Mariano Metz", 
			description: "Karrie Lehner DDS", 
			duedate: DateTime.fromObject({day: 18, month: 3, year: 2020, hour:22, minute: 44, seconds: 22}), 
			attachment: "Yetta Lind"
		}

		let options = {
			uri: `${baseUrl}/${id}`,
			json: true
		}
		request.get(options, function (error, response, responseBody) {
			expect(responseBody.title).to.equal(fixture.title);
			expect(responseBody.description).to.equal(fixture.description);
			expect(DateTime.fromISO(responseBody.duedate).toLocal().toJSON()).to.be.equal(fixture.duedate.toJSON());
			expect(responseBody.attachment).to.equal(fixture.attachment);
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('GET http://localhost:3000/api/tasks/-1 should send status code 404', function (done) {
		let options = {
			uri: `${baseUrl}/-1`,
			json: true
		}
		request.get(options, function (error, response, responseBody) {
			expect(response.statusCode).to.equal(404);
			done();
		});
	});

	it('PUT http://localhost:3000/api/tasks should modify a task', function (done) {
		let fixture = {
			title: "Jarvis Bosco Sr.", 
			description: "Yuko Veum Sr.", 
			duedate: DateTime.fromObject({day: 12, month: 7, year: 2018, hour:13, minute: 47, seconds: 22}), 
			attachment: "Brendon Beer"
		}

		let options = {
			uri: `${baseUrl}/${id}`,
			json: fixture
		}
		request.put(options, function (error, response, responseBody) {
			expect(responseBody.title).to.equal(fixture.title);
			expect(responseBody.description).to.equal(fixture.description);
			expect(DateTime.fromISO(responseBody.duedate).toLocal().toJSON()).to.be.equal(fixture.duedate.toJSON());
			expect(responseBody.attachment).to.equal(fixture.attachment);
			expect(response.statusCode).to.equal(200);
			done();
		});
	});

	it('PUT http://localhost:3000/api/tasks/-1 should send status code 404', function (done) {
		let fixture = {
			title: "Mrs. Earle Stamm", 
			description: "Thaddeus Rippin", 
			duedate: DateTime.fromObject({day: 19, month: 4, year: 2022, hour:5, minute: 57, seconds: 22}), 
			attachment: "Prince Shields"
		}

		let options = {
			uri: `${baseUrl}/-1`,
			json: fixture
		}
		request.put(options, function (error, response, responseBody) {
			expect(response.statusCode).to.equal(404);
			done();
		});
	});

	it('DELETE http://localhost:3000/api/tasks should delete the just created task', function (done) {
		let options = {
			uri: `${baseUrl}/${id}`,
		}
		request.delete(options, function (error, response, responseBody) {
			expect(response.statusCode).to.equal(204);
			// try to fetch the deleted one, which should fail! (404)
			request.get('http://localhost:3000/api/tasks/' + id, function (error, response, body) {
				expect(response.statusCode).to.equal(404);
				done();
			});
		});
	});

	it('DELETE http://localhost:3000/api/tasks/-1 should send status code 404', function (done) {
		let options = {
			uri: `${baseUrl}/-1`,
		}
		request.delete(options, function (error, response, responseBody) {
			expect(response.statusCode).to.equal(404);
			done();
		});
	});
});
