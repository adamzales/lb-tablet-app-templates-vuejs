<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"

const props = defineProps({
  showIndicator: {
    type: Boolean,
    default: true
  }
})

const timeText = ref('--:--')
let timerId

const updateTime = () => {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  timeText.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateTime()
  timerId = window.setInterval(updateTime, 1000)
})

onBeforeUnmount(() => {
  if (timerId) {
    window.clearInterval(timerId)
  }
})
</script>

<template>
  <div class="tablet-frame">
    <div class="tablet-time">{{ timeText }}</div>
    <div v-if="props.showIndicator" class="tablet-indicator"></div>
    <div class="tablet-content">
      <slot />
    </div>
  </div>
</template>
