const functions = require('firebase-functions');
const {
  loginUser
} = require('./APIs/users');
const { 
  getAllTodos,
  getTodoById,
  postOneTodo,
  deleteTodo,
  editTodo
} = require('./APIs/todos');

const app = require('express')();

// Users
app.post('/login', loginUser)
// Todos
app.get('/todos', getAllTodos);
app.get('/todo/:todoId', getTodoById);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);
app.put('/todo/:todoId', editTodo);

exports.api = functions.https.onRequest(app);