<script>
import Filter from './components/Filter.vue';
import Item from './components/Item.vue';
import Message from './components/Message.vue';
import { createTodo, getTodos, updateTodo, deleteTodo } from './utils/api';

export default {
  components: {
    Filter,
    Item,
    Message,
  },

  data() {
    return {
      todos: [],
      title: '',
      activeButton: 'all',
      errorMessage: '',
    };
  },
  computed: {
    activeTodosCount() {
      return this.todos.filter(todo => !todo.completed).length;
    },
    completedTodosCount() {
      return this.todos.filter(todo => todo.completed).length;
    },
    visibleTodos() {
      switch(this.activeButton) {
        case 'active':
          return this.todos.filter(todo => !todo.completed);
        case 'completed':
          return this.todos.filter(todo => todo.completed);
        case 'all':
        default:
          return this.todos;
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.title.trim()) {
        createTodo(this.title)
          .then(({ data }) => {
            this.todos = [...this.todos, data];
            this.title = '';
          })
          .catch(() => {
            this.errorMessage('Unable to add todo:');
          });
      } else {
        this.errorMessage('Title should not be empty');
      }
    },
    updateTodoData({id, title, completed}) {
      updateTodo({id, title, completed})
        .then(({ data }) => {
          this.todos = this.todos.map(todo => 
            todo.id === id ? data : todo
          );
        })
        .catch(() => {
          this.errorMessage('Unable to update todo:');
        });
    },
    deleteTodo(todoId) {
      deleteTodo(todoId)
        .then(() => {
          this.todos = this.todos.filter(todo => todo.id !== todoId);
        })
        .catch(() => {
          this.errorMessage('Unable to delete todo:');
        });
    },
    clearCompleted() {
      const completedTodos = this.todos.filter(todo => todo.completed);
      completedTodos.forEach(todo => {
    deleteTodo(todo.id).then(() => {
      this.todos = this.todos.filter(t => t.id !== todo.id);
    }).catch(() => {
      this.errorMessage('Unable to delete todo:');
    });
  });
},
toggleAll() {
  const allCompleted = this.todos.every(todo => todo.completed);

  const newCompletedStatus = !allCompleted;

  this.todos = this.todos.map(todo => ({
    ...todo,
    completed: newCompletedStatus
  }));
  
  this.todos.forEach(todo => {
    updateTodo({ id: todo.id, title: todo.title, completed: newCompletedStatus });
  });
}
  },
  mounted() {
    getTodos()
      .then(({ data }) => {
        this.todos = data;
      })
      .catch(() => {
        this.errorMessage('Error fetching todos:');
      });
  }
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button
          type="button"
          class="todoapp__toggle-all"
          :class="{ 
            active: activeTodosCount === 0, 
            'is-hidden': todos.length === 0 
            }"
          data-cy="ToggleAllButton"
          @click="toggleAll"
        />
        <form @submit.prevent="handleSubmit">
          <input
            data-cy="NewTodoField"
            type="text"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>

      <TransitionGroup 
        name="list" 
        tag="section" 
        class="todoapp__main"
      >
        <Item 
          v-for="(todo, index) in visibleTodos" 
          :key="todo.id" 
          :todo="todo" 
          @remove="deleteTodo(todo.id)"
          @update="updateTodoData"
        />
      </TransitionGroup>

      <footer class="todoapp__footer" data-cy="Footer">
        <span class="todo-count" data-cy="TodosCounter">
          {{ activeTodosCount }} items left
        </span>

        <Filter v-model="activeButton"/>

        <button
          type="button"
          class="todoapp__clear-completed"
          v-if="completedTodosCount > 0"
          @click="clearCompleted"
        >
          Clear completed
        </button>
      </footer>
    </div>
    <Message 
    class="is-warning" 
    v-if="errorMessage !== ''"
    @hide="errorMessage=''"
    >
      {{ errorMessage }}
    </Message>
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  max-height: 60px;
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0);
  max-height: 0;
}
</style>
