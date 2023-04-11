const todoList=require('../todo')
describe('Todo List Test Suite',()=>{
  let todos
  const Today=new Date()
  const ODay=60*60*24*1000
  const Yesterday=new Date(Today.getTime()-(1*ODay))
  const Tomorrow=new Date(Today.getTime()+(1*ODay))
  beforeEach(() => {
    todos=todoList()
  })
  test('creating a new todo',()=>{
    const InitialCount=todos.all.length
    todos.add({title:'First Todo',dueDate:Tomorrow.toISOString().slice(0,10),completed:false})
    expect(todos.all.length).toBe(InitialCount+1)
  })
  test('marking a todo as completed',()=>{
    const todo={title:'First Todo',dueDate:Tomorrow.toISOString().slice(0,10),completed:false}
    todos.add(todo)
    const index=todos.all.findIndex(item=>item===todo)
    todos.markAsComplete(index)
    expect(todos.all[index].completed).toBe(true)
  })
  test('retrieval of overdue items',()=>{
    todos.add({title:'Overdue Todo',dueDate:Yesterday.toISOString().slice(0,10),completed:false})
    todos.add({title:'DueToday Todo',dueDate:Today.toISOString().slice(0,10),completed:false})
    const OverdueCount=todos.overdue().length
    todos.add({title:'Overdue Todo 2',dueDate:Yesterday.toISOString().slice(0,10),completed:false})
    expect(todos.overdue().length).toBe(OverdueCount+1)
  })
  test('retrieval of due today items',()=>{
    todos.add({title:'Overdue Todo',dueDate:Yesterday.toISOString().slice(0,10),completed:false})
    todos.add({title:'DueToday Todo',dueDate:Today.toISOString().slice(0,10),completed:false})
    const DueTodayCount=todos.dueToday().length
    todos.add({title:'DueToday Todo new',dueDate:Today.toISOString().slice(0,10),completed:false})
    expect(todos.dueToday().length).toBe(DueTodayCount+1)
  })

  test('retrieval of due later items',()=>{
    todos.add({title:'Overdue Todo',dueDate:Yesterday.toISOString().slice(0,10),completed:false})
    todos.add({title:'DueToday Todo',dueDate:Today.toISOString().slice(0,10),completed:false})
    todos.add({title:'DueLater Todo',dueDate:Tomorrow.toISOString().slice(0,10),completed:false})
    const DueLaterCount=todos.dueLater().length
    todos.add({title:'DueLater Todo new',dueDate:Tomorrow.toISOString().slice(0,10),completed:false})
    expect(todos.dueLater().length).toBe(DueLaterCount+1)
  })
})
