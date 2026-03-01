const CACHE_VERSION = '1.0.0'
const CACHE_KEYS = {
  POKEMON_LIST: 'pokedex_pokemon_list',
  VERSION: 'pokedex_cache_version'
}

const isCacheValid = () => {
  try {
    const cachedVersion = localStorage.getItem(CACHE_KEYS.VERSION)
    return cachedVersion === CACHE_VERSION
  } catch {
    return false
  }
}

export const cachePokemonList = (pokemonList) => {
  try {
    const lightweight = pokemonList.map(({ name, url }) => ({ name, url }))
    localStorage.setItem(CACHE_KEYS.POKEMON_LIST, JSON.stringify(lightweight))
    localStorage.setItem(CACHE_KEYS.VERSION, CACHE_VERSION)
  } catch (error) {
    console.warn('Falha ao salvar cache:', error)
  }
}

export const getCachedPokemonList = () => {
  if (!isCacheValid()) {
    clearCache()
    return null
  }

  try {
    const cached = localStorage.getItem(CACHE_KEYS.POKEMON_LIST)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.warn('Falha ao ler cache:', error)
    return null
  }
}

export const clearCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Falha ao limpar cache:', error)
  }
}

export const getCacheInfo = () => {
  try {
    const cached = getCachedPokemonList()
    return {
      isValid: isCacheValid(),
      version: localStorage.getItem(CACHE_KEYS.VERSION),
      itemCount: cached ? cached.length : 0,
      sizeKB: cached ? (JSON.stringify(cached).length / 1024).toFixed(2) : 0
    }
  } catch {
    return { isValid: false, version: null, itemCount: 0, sizeKB: 0 }
  }
}
