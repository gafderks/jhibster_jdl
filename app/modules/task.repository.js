'use strict';

let mysql = require('mysql');
const util = require('util');

class TaskRepository {

	constructor() {
		// create a MySQL connection
		this.connection = mysql.createConnection({
			host: 'db', 
			port: 3306, 
			database: 'jhipster_jdl', 
			user: 'gafderks', 
			password: 'poedel', 
			typeCast: function castField( field, useDefaultTypeCasting ) {
				if (field.type === 'TINY' && field.length === 1) {
					var bytes = field.buffer();
					return( bytes == 1 );
				}
				else {
					return useDefaultTypeCasting();
				}
			}
		});
		this.connection.connect(function (err) {
			if (err) {
				throw err;
			} else {
				// console.log('Connected!');
			}
		});
		this.connection.query = util.promisify(this.connection.query); // Magic happens here.
	}

	async findAll() {
		let tasks = await this.connection.query('select id, title, description, duedate, attachment from tasks');
		for(let task of tasks) {
		}

		return tasks;
	}

	async create(task) {
		let rowResult = await this.connection.query("insert into tasks set ?", [task]);
		let id = rowResult.insertId;

		return await this.findById(id);
	}



	async findById(id) { // be aware: returns a Promise
		let rows = await this.connection.query('select id, title, description, duedate, attachment from tasks where tasks.id=?', [id]);
		// this SHOULD be one row(s) but we have to handle it like there might be more ... 
		if(rows && rows[0]){
			let task=rows[0];

			return task;
		}
	}

	async updateById(id, data) {
		let resultPacket = await this.connection.query('update tasks set title=?, description=?, duedate=?, attachment=? where id=?', [data.title, data.description, data.duedate, data.attachment, id]);
		if (resultPacket.affectedRows > 0) {
			// fetch the new row after updating!!!
			let updatedTask = await this.findById(id);

			return updatedTask;
		}
		else {
			return false;
		}
	}



	async deleteById(id) {
		try {
			let packetResult = await this.connection.query("delete from tasks where id='?'", id);

			return packetResult.affectedRows === 1;
		}
		catch (error) { // happens when deletion fails because of constraints
			throw error;
		}
	}

}
module.exports = new TaskRepository();
