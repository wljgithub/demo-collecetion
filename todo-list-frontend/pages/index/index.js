const TaskAPI = require('../../apis/task')
Page({
  data: {
    input: '',
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: []
  },
  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },
  load: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function (item) {
        return !item.completed
      }).length
      this.setData({
        todos: todos,
        leftCount: leftCount
      })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({
        logs: logs
      })
    }
  },
  async fetch() {
    return new Promise((resolve, reject) => {
      TaskAPI.getTaskList().then(res => {
        let todos = res.data
        if (todos) {
          let leftCount = todos.filter(item => {
            return !item.completed
          }).length
          this.setData({
            todos: res.data,
            leftCount: leftCount
          })
          resolve(res)
        }
      }).catch(err => {
        wx.showToast({
          title: '获取任务失败',
          icon: 'none'
        })
        reject(err)
      })
    })

  },
  onLoad: function () {
    // this.load()
    this.fetch()
  },

  inputChangeHandle: function (e) {
    this.setData({
      input: e.detail.value
    })
  },

  // addTodoHandle: function (e) {
  //   if (!this.data.input || !this.data.input.trim()) return
  //   var todos = this.data.todos
  //   todos.push({
  //     name: this.data.input,
  //     completed: false
  //   })
  //   var logs = this.data.logs
  //   logs.push({
  //     timestamp: new Date(),
  //     action: 'Add',
  //     name: this.data.input
  //   })
  //   this.setData({
  //     input: '',
  //     todos: todos,
  //     leftCount: this.data.leftCount + 1,
  //     logs: logs
  //   })
  //   this.save()
  // },
  addTodoHandle(e) {

    if (!this.data.input || !this.data.input.trim()) return
    TaskAPI.addTask(this.data.input).then(() => {
      this.fetch()
      this.setData({input:''})
    }).catch(
      err => {
        wx.showModal({
          showCancel: false,
          title: "添加失败",
          content: err.message
        })
        this.setData({input:''})
      }
    )
  },
  // toggleTodoHandle: function (e) {
  //   var index = e.currentTarget.dataset.index
  //   var todos = this.data.todos
  //   todos[index].completed = !todos[index].completed
  //   var logs = this.data.logs
  //   logs.push({
  //     timestamp: new Date(),
  //     action: todos[index].completed ? 'Finish' : 'Restart',
  //     name: todos[index].name
  //   })
  //   this.setData({
  //     todos: todos,
  //     leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
  //     logs: logs
  //   })
  //   this.save()
  // },
  toggleTodoHandle(e) {
    let item = e.currentTarget.dataset.item
    item.completed = !item.completed
    console.log(e)
    TaskAPI.updateOneTask(item).then(() => {
      this.fetch()
    }).catch(() => {
      wx.showToast({
        title: '更新失败',
        icon: "none"
      })
    })
  },

  // removeTodoHandle: function (e) {
  //   var index = e.currentTarget.dataset.index
  //   var todos = this.data.todos
  //   var remove = todos.splice(index, 1)[0]
  //   var logs = this.data.logs
  //   logs.push({
  //     timestamp: new Date(),
  //     action: 'Remove',
  //     name: remove.name
  //   })
  //   this.setData({
  //     todos: todos,
  //     leftCount: this.data.leftCount - (remove.completed ? 0 : 1),
  //     logs: logs
  //   })
  //   this.save()
  // },
  removeTodoHandle(e) {
    let item = e.currentTarget.dataset.item
    if (!item && !item.task_id) return
    TaskAPI.deleteOneTask(item.task_id).then(() => {
      this.fetch().then(() => {
        wx.showToast({
          title: '删除成功',
        })
      })

    }).catch(err => {
      wx.showModal({
        showCancel: false,
        title: "删除失败",
        content: err.message
      })
    })
  },
  toggleAllHandle: function (e) {
    this.data.allCompleted = !this.data.allCompleted
    var todos = this.data.todos
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    this.setData({
      todos: todos,
      leftCount: this.data.allCompleted ? 0 : todos.length,
      logs: logs
    })
    this.save()
  },
  // toggleAllHandle(e) {
  //     this.data.allCompleted = !this.data.allCompleted
  //     let todos = this.data.todos
  //     for (let i in todos) {
  //       todos[i].completed = this.data.allCompleted
  //     }
  //     TaskAPI.updateMultipleTask(todos).then(() => {
  //       this.fetch()
  //     }).catch(err => {
  //       wx.showModal({
  //         showCancel: false,
  //         title: "更新失败",
  //         content: err.message
  //       })
  //     })
  //   },
  clearCompletedHandle(e) {
    let todos = this.data.todos
    let completedTodos = todos.map(item => {
      return item.completed?item.task_id:null
    })
    TaskAPI.deleteMultipleTask(
      completedTodos
    ).then(
      () => {
        this.fetch().then(() => {
          wx.showToast({
            title: '删除成功',
          })
        })
      }
    ).catch(err => {
      wx.showModal({
        showCancel: false,
        title: "删除失败",
        content: err.message
      })
    })
  },
  // clearCompletedHandle: function (e) {
  //     var todos = this.data.todos
  //     var remains = []
  //     for (var i = 0; i < todos.length; i++) {
  //       todos[i].completed || remains.push(todos[i])
  //     }
  //     var logs = this.data.logs
  //     logs.push({
  //       timestamp: new Date(),
  //       action: 'Clear',
  //       name: 'Completed todo'
  //     })
  //     this.setData({
  //       todos: remains,
  //       logs: logs
  //     })
  //     this.save()
  //   }

})