'use strict';

var api = 'http://127.0.0.1:3000/api/tasks';
var tasksDataTable;

$(document).ready(function() {

	let columns = [
		{ 'title': 'Title', 'data': 'title' },
		{ 'title': 'Description', 'data': 'description' },
		{ 'title': 'Duedate', 'data': 'duedate' },
		{ 'title': 'Attachment', 'data': 'attachment' },
	]

	tasksDataTable = $('#tasksDataTable').DataTable({
		'order': [[0, 'asc']],
		'columns': columns
	}); 

	$('#tasksDataTable tbody').on('click', 'tr', function () {
		let taskData = tasksDataTable.row(this).data();
		edit(taskData.id);
	});

	getAll();
	$('#addBtn').click(create);
	$('#saveBtn').click(insert);
	$('#deleteBtn').click(deleteItem);
})

	$('#form').on('shown.bs.modal', function () {
		$('.modal-body :input:visible:first').focus();
	})

function clearForm() {
	$('input').each(function() {
		$(this).val('');
	});
	$('input:checkbox').each(function() {
		$(this).prop('checked', false);
	});
}

function getAll() {
	$.get(api, function(tasks) {
		if (tasks) {
			tasksDataTable.clear();
			tasksDataTable.rows.add(tasks);
			tasksDataTable.columns.adjust().draw();
		}
	});
}

function create() {
	// Set title
	$('#title').text('New Task');

	$('#saveBtn').off('click');
	$('#saveBtn').click(insert);

	// Hide delete button
	$('#deleteBtn').hide();

	// Clear form
	clearForm();

	$('#form').modal({backdrop: 'static'}); // backdrop:static => to prevent closing the modal when clicking outside of it
}

function insert(e) {
	e.preventDefault();

	// Create obj
	let obj = {
		title: $('#title').val(), 
		description: $('#description').val(), 
		duedate: $('#duedate').val(), 
		attachment: $('#attachment').val(), 
	}

	console.log(obj);

	send(api, obj, 'POST');
}
function edit(id) {

	// Set title
	$('#title').text('Edit Task');

	// Show delete button
	$('#deleteBtn').show();

	// Clear form
	clearForm();

	// Get item
	$.get(api+'/'+id, function(task) {
		if (task){
			// Fill form
			$('#title').val(task.title);
			$('#description').val(task.description);
			$('#duedate').val(task.duedate);
			$('#attachment').val(task.attachment);

			$('#saveBtn').off('click');
			$('#saveBtn').click(update);

			$('#form').modal({backdrop: 'static'}); // backdrop:static => to prevent closing the modal when clicking outside of it
		}
	});
}

function update(e) {
	e.preventDefault();

	let id = +$('#id').val();
	console.log('updating ...'+id);

	// Create obj
	let obj = {
		title: $('#title').val(), 
		description: $('#description').val(), 
		duedate: $('#duedate').val(), 
		attachment: $('#attachment').val(), 
	}

	console.log(obj);

	send(api+'/'+id, obj, 'PUT');
}

function deleteItem() {

	let id = +$('#id').val();
	let uri =  `${api}/${id}`;

	// Send data
	$.ajax({
		url: uri,
		type: 'DELETE'
	 }).then(function() {
		 $('#form').modal('toggle');
		getAll();
	});
}

function send(url, obj, method) {
	// Send data
	$.ajax({
		url: url,
		type: method,
		data: JSON.stringify(obj),
		contentType: 'application/json; charset=utf-8'
	}).then(function() {
		$('#form').modal('toggle');
		getAll();
	});
}
