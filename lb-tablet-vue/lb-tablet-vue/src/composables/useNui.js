import { onMounted, onUnmounted } from 'vue'

/**
 * Minimal NUI wrapper.
 * - Listens to messages from the host (FiveM/CEF/etc.)
 * - Optionally falls back to window 'message' events in a browser
 */
export function useNuiEvent(eventName, handler) {
  const onMessage = (ev) => {
    try {
      const data = ev?.data || ev
      // If the host posts objects like { type: 'lb:open', payload: {} }
      if (!eventName || data?.type === eventName) {
        handler(data)
      }
    } catch (e) {
      console.error('useNuiEvent handler failed:', e)
    }
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)
    }
    // If the legacy API exists in the host:
    if (globalThis.useNuiEvent && eventName) {
      try { globalThis.useNuiEvent(eventName, handler) } catch {}
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', onMessage)
    }
    if (globalThis.removeNuiEvent && eventName) {
      try { globalThis.removeNuiEvent(eventName, handler) } catch {}
    }
  })
}

/**
 * Send a message back to host.
 * Example host handler might expect { action: 'my-action', payload: {} }
 */
export function sendNui(action, payload = {}) {
  try {
    if (globalThis.SendCustomAppMessage) {
      globalThis.SendCustomAppMessage({ action, payload })
    } else if (typeof window !== 'undefined') {
      window.postMessage({ action, payload }, '*')
    }
  } catch (e) {
    console.error('sendNui failed:', e)
  }
}
