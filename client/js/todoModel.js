/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = [];
		this.graphql('todos', 'query { todos { id, title, completed } }');
		this.onChanges = [];
	};

	app.TodoModel.prototype.graphql = function(queryName, queryString) {
		console.log(queryString,">>>>>>>>>>>>>>>>>>>>>>.")
		$.ajax({
			method: 'POST',
			contentType: 'application/graphql',
			url: '/graphql',
			data: queryString
		}).done(function(response, code) {
			console.log(response.data)
			this.todos = response.data[queryName] || [];
			this.inform();
		}.bind(this));
	};


	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
		this.graphql('add', `
			mutation {
				add (title: "${title}") {
					_id,
					title,
					completed
				}
			}
		`);
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		this.graphql('toggleAll', `
			mutation {
				toggleAll (checked: ${checked}) {
					id,
					title,
					completed
				}
			}
		`);
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		this.graphql('toggle', `
			mutation {
				toggle (id: ${todoToToggle.id}) {
					id,
					title,
					completed
				}
			}
		`);
	};

	app.TodoModel.prototype.destroy = function (todo) {
		this.graphql('destroy', `
			mutation {
				destroy (id: ${todo.id}) {
					id,
					title,
					completed
				}
			}
		`);
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		this.graphql('save', `
			mutation {
				save (_id: ${todoToSave.id}, title: "${text}") {
					_id,
					title,
					completed
				}
			}
		`);
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.graphql('clearCompleted', `
			mutation {
				clearCompleted {
					id,
					title,
					completed
				}
			}
		`);
	};

})();
