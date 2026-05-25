import { CONFIG } from './constants.js'
import { cachePokemonList, getCachedPokemonList } from './cache.js'

let allPokemonCache = null

export const PokemonAPI = {
  async _fetch(endpoint) {
    const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  async _getOnlyFulfilled(promises) {
    const results = await Promise.allSettled(promises)
    return results.filter(({ status }) => status === 'fulfilled').map(({ value }) => value)
  },

  async fetchDetails(url) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Falha ao buscar: ${url}`)
    return response.json()
  },

  _getImageUrl(sprites) {
    return sprites?.other?.['official-artwork']?.front_default
      ?? sprites?.front_default
      ?? '/assets/img-not-found.svg'
  },

  mapPokemon(data) {
    const { id, name, types, sprites, stats, height, weight, abilities, base_experience } = data
    return {
      id,
      name,
      types: types.map(({ type }) => type.name),
      primaryType: types[0]?.type.name ?? 'normal',
      imgUrl: this._getImageUrl(sprites),
      number: `#${String(id).padStart(3, '0')}`,
      height: height / 10,
      weight: weight / 10,
      baseExperience: base_experience ?? 0,
      abilities: abilities.map(({ ability, is_hidden }) => ({
        name: ability.name,
        isHidden: is_hidden
      })),
      stats: {
        hp: stats.find(s => s.stat.name === 'hp')?.base_stat ?? 0,
        attack: stats.find(s => s.stat.name === 'attack')?.base_stat ?? 0,
        defense: stats.find(s => s.stat.name === 'defense')?.base_stat ?? 0,
        spAtk: stats.find(s => s.stat.name === 'special-attack')?.base_stat ?? 0,
        spDef: stats.find(s => s.stat.name === 'special-defense')?.base_stat ?? 0,
        speed: stats.find(s => s.stat.name === 'speed')?.base_stat ?? 0,
      },
      captureRate: 0,
      evolutions: []
    }
  },

  async fetchSpeciesData(id) {
    try {
      const species = await this._fetch(`/pokemon-species/${id}`)
      const captureRate = species.capture_rate ?? 0

      let evolutions = []
      if (species.evolution_chain?.url) {
        const evolutionData = await fetch(species.evolution_chain.url).then(r => r.json())
        evolutions = await this._parseEvolutionChain(evolutionData.chain)
      }

      return { captureRate, evolutions }
    } catch (error) {
      console.warn('Erro ao buscar species:', error)
      return { captureRate: 0, evolutions: [] }
    }
  },

  async _parseEvolutionChain(chain) {
    const evolutions = []

    const addEvolution = (node) => {
      const id = parseInt(node.species.url.split('/').filter(Boolean).pop())
      evolutions.push({
        id,
        name: node.species.name,
        imgUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      })

      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach(addEvolution)
      }
    }

    addEvolution(chain)
    return evolutions
  },

  async fetchList(page, perPage) {
    const offset = (page - 1) * perPage
    const { results, count } = await this._fetch(`/pokemon?limit=${perPage}&offset=${offset}`)

    const details = await this._getOnlyFulfilled(
      results.map(({ url }) => this.fetchDetails(url))
    )
    return { pokemons: details.map(data => this.mapPokemon(data)), total: count }
  },

  async fetchByType(type, page, perPage) {
    const { pokemon } = await this._fetch(`/type/${type}`)

    const allUrls = pokemon.map(p => p.pokemon.url)
    const offset = (page - 1) * perPage
    const pageUrls = allUrls.slice(offset, offset + perPage)

    const details = await this._getOnlyFulfilled(
      pageUrls.map(url => this.fetchDetails(url))
    )
    return { pokemons: details.map(data => this.mapPokemon(data)), total: allUrls.length }
  },

  async search(query, page, perPage) {
    if (!allPokemonCache) {
      allPokemonCache = getCachedPokemonList()
    }

    if (!allPokemonCache) {
      const { results } = await this._fetch(`/pokemon?limit=${CONFIG.MAX_POKEMON_LIMIT}&offset=0`)
      allPokemonCache = results
      cachePokemonList(results)
    }

    const filtered = allPokemonCache.filter(p =>
      p.name.includes(query.toLowerCase().trim())
    )

    if (filtered.length === 0) return { pokemons: [], total: 0 }

    const offset = (page - 1) * perPage
    const details = await this._getOnlyFulfilled(
      filtered.slice(offset, offset + perPage).map(p => this.fetchDetails(p.url))
    )
    return { pokemons: details.map(data => this.mapPokemon(data)), total: filtered.length }
  }
}
export const getPokemons = (page, perPage) => PokemonAPI.fetchList(page, perPage)
export const getPokemonsByType = (type, page, perPage) => PokemonAPI.fetchByType(type, page, perPage)
export const searchPokemons = (query, page, perPage) => PokemonAPI.search(query, page, perPage)
