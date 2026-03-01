import { CONFIG } from './constants.js'

class ReactiveState {
  #state = {
    currentPage: 1,
    perPage: CONFIG.PER_PAGE,
    query: '',
    total: 0,
    activeType: null,
  }

  #listeners = new Map()

  get() {
    return Object.freeze({ ...this.#state })
  }

  set(updates, options = {}) {
    const oldState = { ...this.#state }
    this.#state = { ...this.#state, ...updates }

    if (!options.silent) {
      Object.keys(updates).forEach(key => {
        if (oldState[key] !== this.#state[key]) {
          this.#notify(key, this.#state[key], oldState[key])
        }
      })
      this.#notify('*', this.#state, oldState)
    }
  }

  reset() {
    this.set({
      currentPage: 1,
      perPage: CONFIG.PER_PAGE,
      query: '',
      total: 0,
      activeType: null,
    })
  }
  subscribe(key, callback) {
    if (!this.#listeners.has(key)) {
      this.#listeners.set(key, [])
    }
    this.#listeners.get(key).push(callback)

    return () => {
      const callbacks = this.#listeners.get(key)
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  #notify(key, newValue, oldValue) {
    const callbacks = this.#listeners.get(key) || []
    callbacks.forEach(callback => callback(newValue, oldValue))
  }
}

export const appState = new ReactiveState()
