var TodoModel=require("./todo.model.js");

exports.addTodo=(function(payload,resolve){
	var todo=new TodoModel(payload);
	console.log(payload,">>>>payloa")
	todo.save(function(err,todo){
		console.log(todo,err)
		return resolve([todo])
	})
});
exports.list=(function(resolve){
	TodoModel.find(function(err,data){
		console.log(data,">>>>>>>>>>>>>>>>>>");
		resolve(data)
	})
});

exports.deleteTodo=(function(id,callback){
	TodoModel.findById(id,function(err,data){
		if(err){
			console.log(err);
			return
		}
		data.remove(function(err,user){
			callback(err,data)
		})
	});
});
exports.update=(function(payload,callback){
	TodoModel.update({_id:payload.id},{completed: payload.completed},function(err,data){
		if(err){
			console.log(err);
			return
		}
		callback(err,data)
	});
});