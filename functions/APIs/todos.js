const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
  db
    .collection('todos')
    .where('username', '==', request.user.username)
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        });
      })
      return response.json(todos)
    })
    .catch((err) => {
      console.log(
        "======================\nerror getting todos\n======================\n",
        err.details
      );
      return response.status(500).json({error: err.code})
    })
}

exports.getTodoById = (req, res) => {
  // if
  db
    .doc(`/todos/${req.params.todoId}`)
    .get()
    .then((todo) => {
      if(!todo.exists) {
        return res.status(404).json({ message: 'todo not found' })
      }
      return res.status(200).json(todo.data())
    })
    .catch((err) => {
      return res.status(500).json({ message: 'error getting todo' })
    })
}

exports.postOneTodo = (request, response) => {
  if (request.body.body.trim() === '') {
    return response.status(400).json({ body: 'Must not be empty' })
  }

  if (request.body.title.trim() === '') {
    return response.status(400).json({title: 'Must not be empty'})
  }

  const { title, body, createdAt } = request.body;
  
  const newTodoItem = {
    title: title,
    body: body,
    createdAt: new Date().toISOString(),
    username: request.user.username
  }

  db
    .collection('todos')
    .add(newTodoItem)
    .then((doc) => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem)
    })
    .catch((err) => {
      response.status(500).json({error: 'Something went wrong'})
      console.error(err)
    })
}

exports.deleteTodo = (request, response) => {
  const document = db.doc(`/todos/${request.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if(!doc.exists) {
        return response.status(404).json({ error: 'Todo not found'})
      }
      if(doc.data().username !== request.user.username) {
        return response.status(403).json({ error: "Unauthorized" })
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: 'Deleted successfully' })
    })
    .catch((err) => {
      console.log('err', err)
      return response.status(500).json({ error: err.code })
    })
}

exports.editTodo = (request, response) => {
  if(request.body.todoId || request.body.createdAt) {
    response.status(403).json({ message: 'Not allowed to edit Title or Timestamp' });
  }
  let document = db.doc(`/todos/${request.params.todoId}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: 'Updated todo successfully' })
    })
    .catch((err) => {
      return response.status(500).json({ error: err.code })
    })
}