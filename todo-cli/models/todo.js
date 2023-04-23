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
      const overdueList = await Todo.overdue();
      const overdueItems = overdueList.map((todo) => todo.displayableString());
      console.log(overdueItems.join("\n").trim());
      console.log("\n");
      console.log("Due Today");
      const dueTodayList = await Todo.dueToday();
      const dueTodayItems = dueTodayList.map((todo) => todo.displayableString());
      console.log(dueTodayItems.join("\n").trim());
      console.log("\n");
      console.log("Due Later");
      const duelaterlist = await Todo.dueLater();
      const dueLaterItems = duelaterlist.map((todo) => todo.displayableString());
      console.log(dueLaterItems.join("\n").trim());
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op1.lte]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op1.lte]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op1.gte]: new Date(),
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
       `${this.id}. ${checkbox1} ${this.title} ${new Date(this.dueDate).toISOString()}`.trim();
       `${this.id}. ${checkbox1} ${this.title}`.trim();
       `${this.id}. ${checkbox1} ${this.title}`.trim();
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
