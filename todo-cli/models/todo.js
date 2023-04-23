// models/todo.js
'use strict';
const {
  Model,
  Op
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueList = await Todo.overdue();
      overdueList.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      const todayList = await Todo.dueToday();
      todayList.forEach((todo) => {
        console.log(todo.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      const laterList = await Todo.dueLater();
      laterList.forEach((todo) => {
        console.log(todo.displayableString());
      });
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      todo.completed = true;
      await todo.save();
    }

   Todo.prototype.displayableString = function() {
  const currentDate = new Date();
  const isCompleted = this.completed;
  const isPastDue = currentDate > this.dueDate;
  const isDueToday = currentDate.toDateString() === this.dueDate.toDateString();
  const id = this.id;
  const title = this.title;
  let displayableDate = '';
  let status = '';
  
  if (isDueToday) {
    displayableDate = '';
  } else if (!isCompleted) {
    displayableDate = ' ' + this.dueDate.toDateString();
  }

  if (isCompleted) {
    status = 'x';
  }

  return id + '. [' + status + '] ' + title + displayableDate;
};
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
