<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import Frame from './components/Frame.vue'
import TabletSurface from './components/TabletSurface.vue'
import { useNuiEvent } from './composables/useNui'

const devMode = typeof globalThis.invokeNative !== 'function'
const theme = ref('light')
const direction = ref('N')
const indicatorVisible = ref(true)
const notificationText = ref('Notification text')

const appHeight = computed(() => (typeof globalThis.invokeNative === 'function' ? '100vh' : '100%'))
const indicatorLabel = computed(() => (indicatorVisible.value ? 'Hide Indicator' : 'Show Indicator'))

const ensureVisibility = () => {
  if (typeof document !== 'undefined') {
    try {
      document.documentElement.style.visibility = 'visible'
      document.body.style.visibility = 'visible'
    } catch (error) {
      console.warn('[tablet] visibility update failed', error)
    }
  }
}

const resolveDirection = (payload) => {
  if (typeof payload === 'string') return payload
  if (payload && typeof payload.direction === 'string') return payload.direction
  if (payload && typeof payload.payload !== 'undefined') return resolveDirection(payload.payload)
  return null
}

const openPopup = () => {
  if (typeof globalThis.setPopUp === 'function') {
    globalThis.setPopUp({
      title: 'Popup Menu',
      description: 'Confirm your choice',
      buttons: [
        {
          title: 'Cancel',
          color: 'red',
          cb: () => console.log('Cancel')
        },
        {
          title: 'Confirm',
          color: 'blue',
          cb: () => console.log('Confirm')
        }
      ]
    })
  } else if (import.meta.env.DEV) {
    console.info('[dev] setPopUp')
  }
}

const openContextMenu = () => {
  const handler = globalThis.components?.setContextMenu
  if (typeof handler === 'function') {
    handler({
      title: 'Context menu',
      buttons: [
        {
          title: 'Phone Notification',
          color: 'blue',
          cb: () => {
            if (typeof globalThis.sendNotification === 'function') {
              globalThis.sendNotification({ title: notificationText.value })
            }
          }
        },
        {
          title: 'GTA Notification',
          color: 'red',
          cb: () => {
            if (typeof globalThis.fetchNui === 'function') {
              globalThis.fetchNui('drawNotification', { message: notificationText.value })
            }
          }
        }
      ]
    })
  } else if (import.meta.env.DEV) {
    console.info('[dev] setContextMenu')
  }
}

const openGallery = () => {
  const handler = globalThis.components?.setGallery
  if (typeof handler === 'function') {
    handler({
      includeVideos: true,
      includeImages: true,
      cb: (data) => {
        if (typeof globalThis.setPopUp === 'function') {
          globalThis.setPopUp({
            title: 'Selected media',
            attachment: data,
            buttons: [
              { title: 'OK' }
            ]
          })
        }
      }
    })
  } else if (import.meta.env.DEV) {
    console.info('[dev] setGallery')
  }
}

const toggleIndicator = () => {
  indicatorVisible.value = !indicatorVisible.value
  const handler = globalThis.components?.setIndicatorVisible
  if (typeof handler === 'function') {
    handler(indicatorVisible.value)
  } else if (import.meta.env.DEV) {
    console.info('[dev] setIndicatorVisible', indicatorVisible.value)
  }
}

const openColorPicker = () => {
  const handler = globalThis.components?.setColorPicker
  if (typeof handler === 'function') {
    handler((color) => {
      if (typeof globalThis.setPopUp === 'function') {
        globalThis.setPopUp({
          title: 'Selected color',
          description: color,
          buttons: [
            { title: 'OK' }
          ]
        })
      }
    })
  } else if (import.meta.env.DEV) {
    console.info('[dev] setColorPicker')
  }
}

const handleNotificationInput = (value) => {
  notificationText.value = value
}

useNuiEvent('updateDirection', (payload) => {
  const next = resolveDirection(payload)
  if (next) {
    direction.value = next
  }
})

onMounted(() => {
  if (devMode) {
    ensureVisibility()
  } else {
    theme.value = globalThis.settings?.display?.theme || 'light'

    if (typeof globalThis.onSettingsChange === 'function') {
      try {
        globalThis.onSettingsChange((settings = {}) => {
          const nextTheme = settings?.display?.theme
          if (typeof nextTheme === 'string') {
            theme.value = nextTheme
          }
        })
      } catch (error) {
        console.error('[tablet] onSettingsChange handler failed', error)
      }
    }

    if (!globalThis.GetParentResourceName) {
      ensureVisibility()
    }
  }
})

watch(notificationText, (value) => {
  if (value === '') {
    notificationText.value = 'Notification text'
  }
})
</script>

<template>
  <div>
    <div v-if="devMode" class="dev-wrapper">
      <Frame :show-indicator="indicatorVisible">
        <TabletSurface
          :theme="theme"
          :direction="direction"
          :indicator-visible="indicatorVisible"
          :indicator-label="indicatorLabel"
          :notification-text="notificationText"
          :app-height="appHeight"
          :on-open-popup="openPopup"
          :on-open-context-menu="openContextMenu"
          :on-open-gallery="openGallery"
          :on-toggle-indicator="toggleIndicator"
          :on-open-color-picker="openColorPicker"
          @update:notificationText="handleNotificationInput"
        />
      </Frame>
    </div>
    <TabletSurface
      v-else
      :theme="theme"
      :direction="direction"
      :indicator-visible="indicatorVisible"
      :indicator-label="indicatorLabel"
      :notification-text="notificationText"
      :app-height="appHeight"
      :on-open-popup="openPopup"
      :on-open-context-menu="openContextMenu"
      :on-open-gallery="openGallery"
      :on-toggle-indicator="toggleIndicator"
      :on-open-color-picker="openColorPicker"
      @update:notificationText="handleNotificationInput"
    />
  </div>
</template>
