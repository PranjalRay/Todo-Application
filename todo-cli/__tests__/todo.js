const todoList = require("../todo");
const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();
describe("Todo Manager Test Suite", () => {
  var dateToday = new Date();
  const today = dateToday.toLocaleDateString("en-CA");
  let yesterday = new Date(new Date().setDate(dateToday.getDate() - 1));
  yesterday = yesterday.toLocaleDateString("en-CA");
  let tomorrow = new Date(new Date().setDate(dateToday.getDate() + 1));
  tomorrow = tomorrow.toLocaleDateString("en-CA");
  test("Add task", () => {
    expect(all.length).toBe(0);
    add({ title: "To Learn JS", dueDate: today, completed: false });
    expect(all.length).toBe(1);
  });
  test("Marking Task to be Complete", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("Getting DueToday Tasks", () => {
    expect(dueToday().length).toBe(1);
  });
  test("Getting DueLater Tasks", () => {
    add({ title: "To Learn JS", dueDate: tomorrow, completed: false });
    expect(dueLater().length).toBe(1);
  });
  test("Getting Overdue Tasks", () => {
    add({ title: "To Learn JS", dueDate: yesterday, completed: false });
    expect(overdue().length).toBe(1);
  });
});
