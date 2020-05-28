'use strict';

class TaskService {

	constructor() {
		this.repository=require('./task.repository');
	}

	async findAll() {
		return await this.repository.findAll();
	}

	 async save(task) {

		return await this.repository.create(task);
	}





	async findById(id) { // be aware: returns a Promise

		 return await this.repository.findById(id);
	}

	async updateById(id, data) {
		return await this.repository.updateById(id, data);
	}

	async deleteById(id) {

		try {
			return await this.repository.deleteById(id);
		}
		catch (error) {
			throw error;
		}
	}

}

module.exports = new TaskService();
