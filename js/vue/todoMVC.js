var app = new Vue({
  el: "#app",
  data: {
    todo: "",
    todos: [],
    status: "all",
    editing: -1,
  },
  created() { //放在生命周期函数,实例已经创建完成之后被调用
    try {
      this.todos = JSON.parse(localStorage.TODOS)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    add() {
      if (this.todo.trim()) {
        this.todos.push({
          content: this.todo,
          done: false
        })
        this.todo = ""
      }
    },
    edit(i, e) {
      this.editing = i
        //事件循环结束后再执行
      Vue.nextTick(function() {
          e.target.nextElementSibling.focus()
        })
        // 或
        // setTimeout(() => {
        //   e.target.nextElementSibling.focus()
        // })
    },
    remove(i) {
      this.todos.splice(i, 1)
    },
    removeComp() {
      this.todos = this.todos.filter(x => !x.done)
    },
  },
  watch: {
    todos: {
      handler: function(newVal, oldVal) {
        localStorage.TODOS = JSON.stringify(newVal)
      },
      deep: true
    },
  },
  computed: {
    alldone: {
      get() {
        return this.todos.every(x => x.done)
      },
      set(val) {
        this.todos.forEach(x => x.done = val)
      }
    },
    hasCompleted: function() {
      return this.todos.some(a => a.done)
    },
    currentTodos: function() {
      if (this.status == "all") {
        return this.todos
      }
      if (this.status == "active") {
        return this.todos.filter(x => !x.done)
      }
      if (this.status == "completed") {
        return this.todos.filter(x => x.done)
      }
    }
  }
})