<script>
export default {
  name: 'Message',
  emits: ['hide'],
  props: {
    active: Boolean,
  },
  methods: {
    close() {
      this.$emit('hide')
    }
  }
}
</script>
<template>
     <article
      class="message"
      :class="{ 'message--hidden': !active}"
    >
    <div class="message-header">
      <p>Error</p>
      <button class="delete" @click="close" />
    </div>
      <div class="message-body">
        <slot></slot>
      </div>
    </article>
</template>