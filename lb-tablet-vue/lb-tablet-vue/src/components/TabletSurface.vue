<script setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  },
  direction: {
    type: String,
    default: 'N'
  },
  indicatorVisible: {
    type: Boolean,
    default: true
  },
  indicatorLabel: {
    type: String,
    default: 'Hide Indicator'
  },
  notificationText: {
    type: String,
    default: 'Notification text'
  },
  appHeight: {
    type: String,
    default: '100%'
  },
  onOpenPopup: {
    type: Function,
    required: true
  },
  onOpenContextMenu: {
    type: Function,
    required: true
  },
  onOpenGallery: {
    type: Function,
    required: true
  },
  onToggleIndicator: {
    type: Function,
    required: true
  },
  onOpenColorPicker: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:notificationText'])

const handleInput = (event) => {
  emit('update:notificationText', event?.target?.value ?? '')
}
</script>

<template>
  <div class="app" :data-theme="props.theme">
    <div class="app-wrapper" :style="{ height: props.appHeight }">
      <div class="header">
        <div class="title">Custom App Template</div>
        <div class="subtitle">Vue JS</div>
        <a class="subtitle" id="direction">{{ props.direction }}</a>
      </div>
      <div class="button-wrapper">
        <button id="button" type="button" @click="props.onOpenPopup">Popup Menu</button>
        <button id="context" type="button" @click="props.onOpenContextMenu">Context menu</button>
        <button id="gallery" type="button" @click="props.onOpenGallery">Gallery Selector</button>
        <button id="indicator" type="button" @click="props.onToggleIndicator">
          {{ props.indicatorLabel }}
        </button>
        <button id="colorpicker" type="button" @click="props.onOpenColorPicker">Color Picker</button>
        <input
          id="notification-input"
          :value="props.notificationText"
          placeholder="Notification text"
          @input="handleInput"
        />
      </div>
    </div>
  </div>
</template>
