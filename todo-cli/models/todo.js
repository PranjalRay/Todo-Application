'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");
      console.log("Overdue");
      const overdueList1 = await Todo.overdue();
      const overdueItems1 = overdueList1.map((todo) => todo.displayableString());
      console.log(overdueItems1.join("\n").trim());
      console.log("\n");
      console.log("Due Today");
      const dueTodayList1 = await Todo.dueToday();
      const dueTodayItems1 = dueTodayList1.map((todo) => todo.displayableString());
      console.log(dueTodayItems1.join("\n").trim());
      console.log("\n");
      console.log("Due Later");
      const dueLaterList1 = await Todo.dueLater();
      const dueLaterItems1 = dueLaterList1.map((todo) => todo.displayableString());
      console.log(dueLaterItems1.join("\n").trim());
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      return await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const day1 = new Date(this.dueDate);
      return day1.getDate() === new Date().getDate()
        ? `${this.id}. ${checkbox} ${this.title}`.trim()
        : `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`.trim();
    }
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
