const functions = require('firebase-functions');

const app = require('express')();

const { 
  getAllTodos,
  getTodoById,
  postOneTodo,
  deleteTodo,
  editTodo
} = require('./APIs/todos');

app.get('/todos', getAllTodos);
app.get('/todo/:todoId', getTodoById);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);
app.put('/todo/:todoId', editTodo);

exports.api = functions.https.onRequest(app);