const functions = require('firebase-functions');

const app = require('express')();

const { 
  getAllTodos,
  postOneTodo,
  deleteTodo
} = require('./APIs/todos');

app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo)

exports.api = functions.https.onRequest(app);