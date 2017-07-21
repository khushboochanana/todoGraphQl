var express = require('express')
var Schema = require('./server/graphql/schema/schema')
var graphQLHTTP = require('express-graphql')
var mongoose = require("mongoose");
var con = mongoose.connect('mongodb://127.0.0.1:27017/graphQlTodo');
var request = require('request');
var bodyParser = require('express-graphql/dist/parseBody').parseBody;


var app = express()
		.use('/gui', graphQLHTTP({
			schema: Schema,
			pretty: true,
			graphiql: true
		}))
		.use('/graphql', function(req, res) {
			bodyParser(req, function (error, data) {
				error && console.error(error);
				request({
					url: process.env.PORT ? 'https://todo-graphql-server.herokuapp.com/graphql' : 'http://localhost:7000/gui', //URL to hit
					method: 'POST',
					headers: {
						'Content-Type': 'application/graphql'
					},
					body: data.query //Set the body as a string
				}, function(error, response, body){
					error && console.error(error);
					res.send(JSON.parse(body));
				});
			})
		} )
		.use(express.static(__dirname + '/examples/react'))
		.listen(process.env.PORT || 7000, function() {
			console.log('listening on *:' + (process.env.PORT || 7000) );
		});
