import { POKEMON_TYPES } from './constants.js'

export const getTypeColor = (type) => POKEMON_TYPES[type]?.color ?? POKEMON_TYPES.normal.color

export const getTypeName = (type) => POKEMON_TYPES[type]?.name ?? type

export const debounce = (fn, wait) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

export const showError = (message) => {
  const ul = document.querySelector('[data-js="pokemons-list"]')
  if (ul) {
    ul.innerHTML = `<li class="error-state">❌ ${message}</li>`
  }
}

export const setLoading = (isLoading, count = 18) => {
  const ul = document.querySelector('[data-js="pokemons-list"]')
  if (!ul) return

  if (isLoading) {
    const skeletons = Array.from({ length: count }, () => `
      <div class="skeleton-card">
        <div class="skeleton-card__top">
          <div class="skeleton-bar skeleton-bar--short"></div>
          <div class="skeleton-bar skeleton-bar--short"></div>
        </div>
        <div class="skeleton-card__image"></div>
        <div class="skeleton-card__name"></div>
      </div>
    `).join('')

    ul.innerHTML = `<li class="loading">${skeletons}</li>`
  }
}
