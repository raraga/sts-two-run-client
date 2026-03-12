export interface Card {
  card_name: string
  card_description: string
  type: string
  rarity: string
  upgraded_description: string
  energy_cost: string
  upgraded_energy_cost: string
  character: string
}

export interface Relic {
  name: string
  description: string
  rarity: string
  character: string
  gameReference: string
}
