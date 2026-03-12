import { ref } from 'vue'
import type { Relic } from '../types/database'
import { getAllRelics, getRelicsByCharacter, getRelicsByRarity } from '../services/database'

const relics = ref<Relic[]>([])
const loaded = ref(false)

export function useRelics() {
  async function loadAll(): Promise<Relic[]> {
    if (!loaded.value) {
      relics.value = getAllRelics()
      loaded.value = true
    }
    return relics.value
  }

  function byCharacter(character: string): Relic[] {
    return getRelicsByCharacter(character)
  }

  function byRarity(rarity: string): Relic[] {
    return getRelicsByRarity(rarity)
  }

  return {
    relics,
    loadAll,
    byCharacter,
    byRarity,
  }
}
