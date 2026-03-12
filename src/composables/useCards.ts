import { ref } from 'vue'
import type { Card } from '../types/database'
import {
  getAllCards,
  getCardsByCharacter,
  getCardsByRarity,
  getCardsByType,
} from '../services/database'

const cards = ref<Card[]>([])
const loaded = ref(false)

export function useCards() {
  async function loadAll(): Promise<Card[]> {
    if (!loaded.value) {
      cards.value = getAllCards()
      loaded.value = true
    }
    return cards.value
  }

  function byCharacter(character: string): Card[] {
    return getCardsByCharacter(character)
  }

  function byRarity(rarity: string): Card[] {
    return getCardsByRarity(rarity)
  }

  function byType(type: string): Card[] {
    return getCardsByType(type)
  }

  return {
    cards,
    loadAll,
    byCharacter,
    byRarity,
    byType,
  }
}
