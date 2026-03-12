import initSqlJs, { type Database } from 'sql.js'
import { saveDatabase, loadDatabase } from './storage'
import type { Card, Relic } from '../types/database'

let db: Database | null = null
let initialized = false

async function getWasmUrl(): Promise<string> {
  return '/sql-wasm.wasm'
}

export async function initDatabase(): Promise<void> {
  if (initialized) return

  const wasmUrl = await getWasmUrl()
  const SQL = await initSqlJs({
    locateFile: () => wasmUrl,
  })

  const savedData = await loadDatabase()

  if (savedData) {
    db = new SQL.Database(savedData)
    console.log('Database loaded from IndexedDB')
  } else {
    db = new SQL.Database()
    await migrateData()
    const data = db.export()
    await saveDatabase(data)
    console.log('Database created and saved to IndexedDB')
  }

  initialized = true
}

async function migrateData(): Promise<void> {
  if (!db) throw new Error('Database not initialized')

  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_name TEXT NOT NULL,
      card_description TEXT,
      type TEXT,
      rarity TEXT,
      upgraded_description TEXT,
      energy_cost TEXT,
      upgraded_energy_cost TEXT,
      character TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS relics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      rarity TEXT,
      character TEXT,
      gameReference TEXT
    )
  `)

  const cards = await fetchCards()
  const stmt = db.prepare(
    `INSERT INTO cards (card_name, card_description, type, rarity, upgraded_description, energy_cost, upgraded_energy_cost, character)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )

  for (const card of cards) {
    stmt.run([
      card.card_name,
      card.card_description,
      card.type,
      card.rarity,
      card.upgraded_description,
      card.energy_cost,
      card.upgraded_energy_cost,
      card.character,
    ])
  }
  stmt.free()

  const relics = await fetchRelics()
  const relicStmt = db.prepare(
    `INSERT INTO relics (name, description, rarity, character, gameReference)
     VALUES (?, ?, ?, ?, ?)`,
  )

  for (const relic of relics) {
    relicStmt.run([
      relic.name,
      relic.description,
      relic.rarity,
      relic.character,
      relic.gameReference,
    ])
  }
  relicStmt.free()
}

async function fetchCards(): Promise<Card[]> {
  const response = await fetch('/data/all_cards.json')
  return response.json()
}

async function fetchRelics(): Promise<Relic[]> {
  const response = await fetch('/data/relics.json')
  return response.json()
}

export function getAllCards(): Card[] {
  if (!db) throw new Error('Database not initialized')
  const results = db.exec('SELECT * FROM cards')
  if (results.length === 0 || !results[0]) return []

  const columns = results[0].columns
  return results[0].values.map((row: unknown[]) => {
    const card: Record<string, unknown> = {}
    columns.forEach((col: string, i: number) => {
      card[col] = row[i]
    })
    return card as unknown as Card
  })
}

export function getCardsByCharacter(character: string): Card[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare('SELECT * FROM cards WHERE character = ?')
  stmt.bind([character])

  const cards: Card[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Card
    cards.push(row)
  }
  stmt.free()
  return cards
}

export function getCardsByRarity(rarity: string): Card[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare('SELECT * FROM cards WHERE rarity = ?')
  stmt.bind([rarity])

  const cards: Card[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Card
    cards.push(row)
  }
  stmt.free()
  return cards
}

export function getCardsByType(type: string): Card[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare('SELECT * FROM cards WHERE type = ?')
  stmt.bind([type])

  const cards: Card[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Card
    cards.push(row)
  }
  stmt.free()
  return cards
}

export function getAllRelics(): Relic[] {
  if (!db) throw new Error('Database not initialized')
  const results = db.exec('SELECT * FROM relics')
  if (results.length === 0 || !results[0]) return []

  const columns = results[0].columns
  return results[0].values.map((row: unknown[]) => {
    const relic: Record<string, unknown> = {}
    columns.forEach((col: string, i: number) => {
      relic[col] = row[i]
    })
    return relic as unknown as Relic
  })
}

export function getRelicsByCharacter(character: string): Relic[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare('SELECT * FROM relics WHERE character = ?')
  stmt.bind([character])

  const relics: Relic[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Relic
    relics.push(row)
  }
  stmt.free()
  return relics
}

export function getRelicsByRarity(rarity: string): Relic[] {
  if (!db) throw new Error('Database not initialized')
  const stmt = db.prepare('SELECT * FROM relics WHERE rarity = ?')
  stmt.bind([rarity])

  const relics: Relic[] = []
  while (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Relic
    relics.push(row)
  }
  stmt.free()
  return relics
}
