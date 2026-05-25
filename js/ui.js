import { getTypeColor, getTypeName, setLoading, showError } from './utils.js'
import { STAT_LABELS, STAT_MAX } from './constants.js'
import { appState } from './state.js'
import { createFocusTrap } from './focusTrap.js'

let currentFocusTrap = null

export const renderPokemons = (pokemons) => {
  const ul = document.querySelector('[data-js="pokemons-list"]')
  ul.innerHTML = ''

  if (pokemons.length === 0) {
    const query = appState.get().query
    ul.innerHTML = `<li class="empty-state">Nenhum pokémon encontrado para "<strong>${query}</strong>".</li>`
    return
  }

  const fragment = document.createDocumentFragment()

  pokemons.forEach((pokemon) => {
    const { name, number, types, imgUrl } = pokemon
    const [firstType] = types

    const li = document.createElement('li')
    li.className = 'card'
    li.tabIndex = 0
    li.style.setProperty('--type-color', getTypeColor(firstType))

    li.innerHTML = `
      <div class="card__top">
        <span class="card__type">${getTypeName(firstType)}</span>
        <span class="card__number">${number}</span>
      </div>
      <img class="card__img" src="${imgUrl}" alt="${name}" loading="lazy" onerror="this.src='/assets/img-not-found.svg'" />
      <h2 class="card__name">${name[0].toUpperCase()}${name.slice(1)}</h2>
    `

    li.addEventListener('click', () => openModal(pokemon))
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModal(pokemon) })

    fragment.append(li)
  })

  ul.append(fragment)
}

export const renderPagination = (onPageChange) => {
  const container = document.querySelector('[data-js="pagination"]')
  if (!container) return

  const state = appState.get()
  const totalPages = Math.max(1, Math.ceil(state.total / state.perPage))

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - state.currentPage) <= 1) {
      pages.push(i)
    }
  }

  const withEllipsis = []
  pages.forEach((page, i) => {
    if (i > 0 && page - pages[i - 1] > 1) withEllipsis.push('...')
    withEllipsis.push(page)
  })

  const prevDisabled = state.currentPage === 1
  const nextDisabled = state.currentPage === totalPages

  container.innerHTML = `
    <button class="pagination__arrow" data-action="prev" ${prevDisabled ? 'disabled' : ''}>
      <img src="assets/${prevDisabled ? 'disabled-left' : 'left'}.png" alt="" />
      <span>Anterior</span>
    </button>
    ${withEllipsis.map(p =>
      p === '...'
        ? `<span class="page">…</span>`
        : `<span class="page ${p === state.currentPage ? 'active' : ''}" data-page="${p}">${p}</span>`
    ).join('')}
    <button class="pagination__arrow" data-action="next" ${nextDisabled ? 'disabled' : ''}>
      <span>Próximo</span>
      <img src="assets/${nextDisabled ? 'disabled-right' : 'right'}.png" alt="" />
    </button>
  `

  container.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', async () => {
      appState.set({ currentPage: Number(el.dataset.page) })
      await onPageChange()
    })
  })

  const prevBtn = container.querySelector('[data-action="prev"]')
  const nextBtn = container.querySelector('[data-action="next"]')

  if (prevBtn) {
    prevBtn.addEventListener('click', async () => {
      if (state.currentPage > 1) {
        appState.set({ currentPage: state.currentPage - 1 })
        await onPageChange()
      }
    })
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      if (state.currentPage < totalPages) {
        appState.set({ currentPage: state.currentPage + 1 })
        await onPageChange()
      }
    })
  }
}

export const openModal = async (pokemon) => {
  const overlay = document.querySelector('[data-js="modal-overlay"]')
  const content = document.querySelector('[data-js="modal-content"]')

  const typePills = pokemon.types.map(type =>
    `<span class="modal__type-pill" style="background:${getTypeColor(type)}">${getTypeName(type)}</span>`
  ).join('')

  const statRows = Object.entries(pokemon.stats).map(([key, value]) => `
    <div class="stat-row">
      <span class="stat-label">${STAT_LABELS[key]}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar">
        <div class="stat-fill"
          data-value="${Math.round((value / STAT_MAX[key]) * 100)}"
          style="background:${getTypeColor(pokemon.primaryType)}">
        </div>
      </div>
    </div>
  `).join('')

  const abilities = pokemon.abilities.map(({ name, isHidden }) => {
    const displayName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    return isHidden
      ? `<span class="ability ability--hidden">${displayName} <small>(Oculta)</small></span>`
      : `<span class="ability">${displayName}</span>`
  }).join('')

  const captureRatePercent = Math.round((pokemon.captureRate / 255) * 100)
  let captureDifficulty = 'Muito Difícil'
  if (captureRatePercent > 66) captureDifficulty = 'Fácil'
  else if (captureRatePercent > 33) captureDifficulty = 'Médio'

  content.innerHTML = `
    <div class="modal__header">
      <img class="modal__image" src="${pokemon.imgUrl}" alt="${pokemon.name}" />
      <div class="modal__title">
        <h2 class="modal__name">${pokemon.name[0].toUpperCase()}${pokemon.name.slice(1)}</h2>
        <p class="modal__number">${pokemon.number}</p>
        <div class="modal__types">${typePills}</div>
      </div>
    </div>

    <div class="modal__body">
      <div class="modal__section">
        <h3>Informações</h3>
        <div class="modal__info">
          <div class="info-item">
            <span class="info-label">Peso</span>
            <span class="info-value">${pokemon.weight} kg</span>
          </div>
          <div class="info-item">
            <span class="info-label">Altura</span>
            <span class="info-value">${pokemon.height} m</span>
          </div>
          <div class="info-item">
            <span class="info-label">XP Base</span>
            <span class="info-value">${pokemon.baseExperience}</span>
          </div>
        </div>
      </div>

      <div class="modal__section">
        <h3>Habilidades</h3>
        <div class="abilities-list">${abilities}</div>
      </div>

      <div class="modal__section">
        <h3>Taxa de Captura</h3>
        <div class="capture-bar">
          <div class="capture-fill" style="width: ${captureRatePercent}%; background: ${getTypeColor(pokemon.primaryType)}"></div>
        </div>
        <span class="capture-label">${captureDifficulty} (${pokemon.captureRate}/255)</span>
      </div>

      <div class="modal__section modal__section--stats">
        <h3>Estatísticas</h3>
        <div class="stats-grid">${statRows}</div>
      </div>

    </div>
  `

  overlay.classList.remove('hidden')
  document.body.style.overflow = 'hidden'

  const modal = overlay.querySelector('.modal')
  if (modal) {
    currentFocusTrap = createFocusTrap(modal)
  }

  const { PokemonAPI } = await import('./api.js')
  const speciesData = await PokemonAPI.fetchSpeciesData(pokemon.id)
  pokemon.captureRate = speciesData.captureRate
  pokemon.evolutions = speciesData.evolutions

  const updatedCapturePercent = Math.round((pokemon.captureRate / 255) * 100)
  let updatedDifficulty = 'Muito Difícil'
  if (updatedCapturePercent > 66) updatedDifficulty = 'Fácil'
  else if (updatedCapturePercent > 33) updatedDifficulty = 'Médio'

  const captureBarEl = content.querySelector('.capture-fill')
  const captureLabelEl = content.querySelector('.capture-label')
  if (captureBarEl) {
    captureBarEl.style.width = `${updatedCapturePercent}%`
  }
  if (captureLabelEl) {
    captureLabelEl.textContent = `${updatedDifficulty} (${pokemon.captureRate}/255)`
  }

  if (pokemon.evolutions.length > 1) {
    const evolutionsHTML = `
      <div class="modal__section modal__section--evolutions">
        <h3>Evoluções</h3>
        <div class="evolution-chain">
          ${pokemon.evolutions.map((evo, i) => `
            <div class="evolution-item ${evo.id === pokemon.id ? 'current' : ''}">
              <img src="${evo.imgUrl}" alt="${evo.name}" />
              <span>${evo.name[0].toUpperCase() + evo.name.slice(1)}</span>
            </div>
            ${i < pokemon.evolutions.length - 1 ? '<span class="evolution-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>
    `
    const bodySection = content.querySelector('.modal__body')
    if (bodySection) {
      bodySection.innerHTML += evolutionsHTML
    }
  }

  requestAnimationFrame(() => {
    content.querySelectorAll('.stat-fill').forEach(bar => {
      bar.style.width = bar.dataset.value + '%'
    })
  })
}

export const closeModal = () => {
  if (currentFocusTrap) {
    currentFocusTrap.release()
    currentFocusTrap = null
  }

  const overlay = document.querySelector('[data-js="modal-overlay"]')
  if (overlay) {
    overlay.classList.add('hidden')
    document.body.style.overflow = ''
  }
}
