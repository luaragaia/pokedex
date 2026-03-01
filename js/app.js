import { appState } from './state.js'
import { getPokemons, getPokemonsByType, searchPokemons } from './api.js'
import { renderPokemons, renderPagination, closeModal } from './ui.js'
import { debounce, setLoading, showError } from './utils.js'
import { CONFIG, POKEMON_TYPES } from './constants.js'

const load = async (shouldScroll = false) => {
  setLoading(true)

  try {
    const state = appState.get()
    let result

    if (state.query) {
      result = await searchPokemons(state.query, state.currentPage, state.perPage)
    } else if (state.activeType) {
      result = await getPokemonsByType(state.activeType, state.currentPage, state.perPage)
    } else {
      result = await getPokemons(state.currentPage, state.perPage)
    }

    appState.set({ total: result.total })
    renderPokemons(result.pokemons)
    renderPagination()

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (error) {
    console.error('Erro ao carregar pokémons:', error)
    showError('Erro ao carregar pokémons. Tente novamente.')
  }
}

const setupTypeFilter = () => {
  const select = document.querySelector('[data-js="type-filter"]')
  if (!select) return

  Object.keys(POKEMON_TYPES).forEach(type => {
    const option = document.createElement('option')
    option.value = type
    option.textContent = POKEMON_TYPES[type].name
    option.style.color = POKEMON_TYPES[type].color
    option.style.fontWeight = '600'
    select.appendChild(option)
  })

  select.addEventListener('change', (e) => {
    const activeType = e.target.value || null
    appState.set({ activeType, currentPage: 1 })

    select.style.color = activeType ? POKEMON_TYPES[activeType].color : '#212E4C'
    select.style.fontWeight = activeType ? '600' : '400'

    load(true)
  })
}

const setupClearFilters = () => {
  const btn = document.querySelector('[data-js="clear-filters"]')
  if (!btn) return

  btn.addEventListener('click', () => {
    const searchInput = document.querySelector('[data-js="search-input"]')
    const typeSelect = document.querySelector('[data-js="type-filter"]')

    if (searchInput) searchInput.value = ''
    if (typeSelect) {
      typeSelect.value = ''
      typeSelect.style.color = '#212E4C'
      typeSelect.style.fontWeight = '400'
    }

    appState.set({ query: '', activeType: null, currentPage: 1 })
    load(true)
  })
}

const setupSearch = () => {
  const input = document.querySelector('[data-js="search-input"]')
  if (!input) return

  input.addEventListener('input', debounce((e) => {
    appState.set({ query: e.target.value.trim(), currentPage: 1 })
    load(true)
  }, CONFIG.DEBOUNCE_DELAY))
}

const setupMobileMenu = () => {
  const toggle = document.querySelector('.mobile-toggle')
  const nav = document.querySelector('.nav-mobile')
  const overlay = document.querySelector('.mobile-overlay')

  if (!toggle || !nav || !overlay) return

  const closeMobileMenu = () => {
    toggle.classList.remove('active')
    nav.classList.remove('active')
    overlay.classList.remove('active')
    document.body.style.overflow = ''
  }

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    nav.classList.toggle('active')
    overlay.classList.toggle('active')
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : ''
  })

  overlay.addEventListener('click', closeMobileMenu)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu)
  })
}

const setupModal = () => {
  const overlay = document.querySelector('[data-js="modal-overlay"]')
  const closeBtn = document.querySelector('[data-js="modal-close"]')

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal()
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal)
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal()
  })
}

const init = () => {
  setupTypeFilter()
  setupClearFilters()
  setupSearch()
  setupMobileMenu()
  setupModal()

  load()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
