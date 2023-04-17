const db = require("../models");
const getJSDate = (day) => {
  if (!Number.isInteger(day)) {
    throw new Error("Need to pass integer as day");
  }
  const today = new Date();
  const oneDay1 = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + day * oneDay1)
}
describe("Tests for todo.js", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  });
  test("Overdue must return all tasks(including completed ones)", async () => {
    const todo = await db.Todo.addTask({ title: "Sample Item", dueDate: getJSDate(-2), completed: false });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });
  test("DueToday must return all tasks(including completed ones)", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({ title: "Sample Item", dueDate: getJSDate(0), completed: false });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });
  test("DueLater must return all tasks(including completed ones)", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({ title: "Sample Item", dueDate: getJSDate(2), completed: false });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });
  test("MarkAsComplete must change `completed` to `true`", async () => {
    const overdueItems = await db.Todo.overdue()
    const aTodo1 = overdueItems[0];
    expect(aTodo1.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo1.id);
    await aTodo1.reload();
    expect(aTodo1.completed).toBe(true);
  })
  test("DisplayableString must return `ID. [x] TITLE DUE_DATE`", async () => {
    const overdueItems = await db.Todo.overdue()
    const aTodo1 = overdueItems[0];
    expect(aTodo1.completed).toBe(true);
    const displayValue = aTodo1.displayableString()
    expect(displayValue).toBe(`${aTodo1.id}. [x] ${aTodo1.title} ${aTodo1.dueDate}`)
  })
  test("DisplayableString must return `ID. [ ] TITLE DUE_DATE`", async () => {
    const dueLaterItems = await db.Todo.dueLater()
    const aTodo1 = dueLaterItems[0];
    expect(aTodo1.completed).toBe(false);
    const displayValue = aTodo1.displayableString()
    expect(displayValue).toBe(`${aTodo1.id}. [ ] ${aTodo1.title} ${aTodo1.dueDate}`)
  })
  test("DisplayableString must return `ID. [ ] TITLE`", async () => {
    const dueTodayItems = await db.Todo.dueToday()
    const aTodo1 = dueTodayItems[0];
    expect(aTodo1.completed).toBe(false);
    const displayValue = aTodo1.displayableString()
    expect(displayValue).toBe(`${aTodo1.id}. [ ] ${aTodo1.title}`)
  })
  test("DisplayableString must return `ID. [x] TITLE`", async () => {
    const dueTodayItems = await db.Todo.dueToday()
    const aTodo1 = dueTodayItems[0];
    expect(aTodo1.completed).toBe(false);
    await db.Todo.markAsComplete(aTodo1.id);
    await aTodo1.reload();
    const displayValue = aTodo1.displayableString()
    expect(displayValue).toBe(`${aTodo1.id}. [x] ${aTodo1.title}`)
  })
});