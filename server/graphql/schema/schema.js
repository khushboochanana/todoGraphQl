var graphql = require('graphql')
var GraphQLObjectType = graphql.GraphQLObjectType
var GraphQLInt = graphql.GraphQLInt
var GraphQLBoolean = graphql.GraphQLBoolean
var GraphQLString = graphql.GraphQLString
var GraphQLList = graphql.GraphQLList
var GraphQLNonNull = graphql.GraphQLNonNull
var GraphQLSchema = graphql.GraphQLSchema

var todoService=require('../../api/todo/todo.service')

var TODOs = [];

var TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: () => ({
    _id: {
      type: GraphQLInt,
      description: 'Todo id'
    },
    title: {
      type: GraphQLString,
      description: 'Task title'
    },
    completed: {
      type: GraphQLBoolean,
      description: 'Flag to mark if the task is completed'
    }
  })
});

var QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => {
        return new Promise(function (resolve, reject) {
          todoService.list( resolve);
      })}
    }
  })
});

var MutationAdd = {
  type: new GraphQLList(TodoType),
  description: 'Add a Todo',
  args: {
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise(function (resolve, reject) {
      todoService.addTodo({
        title: args.title,
        completed: false
      }, resolve);
    })
  }
};

var MutationToggle = {
  type: new GraphQLList(TodoType),
  description: 'Toggle the todo',
  args: {
    _id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  resolve: (root, args) => {
    TODOs
      .filter((todo) => todo._id === args.id)
      .forEach((todo) => todo.completed = !todo.completed)
    return TODOs;
  }
};

var MutationDestroy = {
  type: new GraphQLList(TodoType),
  description: 'Destroy the todo',
  args: {
    _id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    }
  },
  resolve: (root, args) => {
    return TODOs = TODOs.filter((todo) => todo.id !== args.id);
  }
};

var MutationToggleAll = {
  type: new GraphQLList(TodoType),
  description: 'Toggle all todos',
  args: {
    checked: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLBoolean)
    }
  },
  resolve: (root, args) => {
    TODOs.forEach((todo) => todo.completed = args.checked)
    return TODOs;
  }
};

var MutationClearCompleted = {
  type: new GraphQLList(TodoType),
  description: 'Clear completed',
  resolve: () => {
    return TODOs = TODOs.filter((todo) => !todo.completed)
  }
};

var MutationSave = {
  type: new GraphQLList(TodoType),
  description: 'Edit a todo',
  args: {
    _id: {
      name: 'Todo Id',
      type: new GraphQLNonNull(GraphQLInt)
    },
    title: {
      name: 'Todo title',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    TODOs
      .filter((todo) => todo.id === args.id)
      .forEach((todo) => todo.title = args.title)
    return TODOs
  }
}

var MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    toggle: MutationToggle,
    toggleAll: MutationToggleAll,
    destroy: MutationDestroy,
    clearCompleted: MutationClearCompleted,
    save: MutationSave
  }
});

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
