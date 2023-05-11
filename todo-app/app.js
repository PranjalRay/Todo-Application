/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", async (request, response) => {
  const overDueItems = await Todo.overdue();
  const dueTodayItems = await Todo.dueToday();
  const dueLaterItems = await Todo.dueLater();
  response.render("index", {
    title: "Todo application",
    overDueItems,
    dueTodayItems,
    dueLaterItems,
  });
});
app.get("/", async function (request, response) {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
    });
  } else {
    response.json({
      allTodos,
    });
  }
});
app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos");
  try {
    const todo = await Todo.findAll();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.post("/todos", async function (request, response) {
  console.log("Creating a todo", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (todo) {
      const deletedTodo = await todo.deleteTodo();
      return response.json(true);
    } else {
      return response.json(false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
module.exports = app;
