<script>
export default {
  name: 'Item',
  props: {
    todo: Object,
  },
  emits: ['update', 'remove'],
  data() {
    return {
      editing: false,
      newTitle: this.todo.title,
    };
  },
  methods: {
    toggle() {
      this.$emit('update', {
        ...this.todo,
        completed: !this.todo.completed,
      });
    },
    remove() {
      this.$emit('remove')
    },
    edit() {
      this.newTitle = this.todo.title;
      this.editing = true;
      this.$nextTick(() => {
        this.$refs['title-field'].focus();
      });
    },
    rename() {
      if (!this.editing) {
        return
      };

      this.editing = false;

      if(this.newTitle === this.todo.title) {
        return
      };

      if(this.newTitle === '') {
        this.remove();
        return
      };

    if (this.newTitle.trim() !== '') {
      const updatedTodo = { ...this.todo, title: this.newTitle };
      this.$emit('update', updatedTodo);
    }
    },
  },
}
</script>

<template>
  <div
    class="todo"
    :class="{ completed: todo.completed }"
  >
    <label class="todo__status-label">
      <input
        type="checkbox"
        class="todo__status"
        :checked="todo.completed"
        @change="toggle"
      />
    </label>
    <template v-if="editing">
      <form @submit.prevent="rename">
        <input
          data-cy="TodoTitleField"
          type="text"
          class="todo__title-field"
          placeholder="Empty todo will be deleted"
          v-model.trim="newTitle"
          ref="title-field"
          @keyup.esc="editing = false"
          @blur="rename"
        />
      </form>
    </template>
    <template v-else>
      <span 
        data-cy="TodoTitle" 
        class="todo__title" 
        @dblclick="edit"
      > 
        {{ todo.title }} 
      </span>
      <button
        type="button"
        class="todo__remove"
        data-cy="TodoDelete"
        @click="remove"
      >
        ×
      </button>
    </template>
  </div>
</template>
