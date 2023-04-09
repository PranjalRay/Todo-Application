const todoList = () => {
  all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    const today = new Date().toISOString().split('T')[0]
    return all.filter(item => !item.completed && item.dueDate < today)
  }

  const dueToday = () => {
    const today = new Date();
    const todayFormatted = formattedDate(today);
    const dueTodayItems = all.filter((item) => item.dueDate === todayFormatted);
    return dueTodayItems;
  }

  const dueLater = () => {
    const today = new Date().toISOString().split('T')[0]
    return all.filter(item => !item.completed && item.dueDate > today)
  }

  const toDisplayableList = (list) => {
    return list
      .map(
        (item, index) =>
          `${item.completed ? "[x]" : "[ ]"} ${item.title}${
            item.dueDate === today ? "" : " " + item.dueDate
          }`
      )
      .join("\n");
  };
  
return {
  all,
  add,
  markAsComplete,
  overdue,
  dueToday,
  dueLater,
  toDisplayableList
};
};

module.exports = todoList;
