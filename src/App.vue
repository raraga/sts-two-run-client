<script setup lang="ts">
import data from '../data/defect-first-victory.json'

const character = data.players[0]?.character?.split('.')[1]
const totalSeconds = data.start_time
const victory = data.win
const runTime = data.run_time / 60
const potions = data.players[0]!.potions.map((potion) => potion.id)
const deck = data.players[0]!.deck
const relics = data.players[0]!.relics.map((relic) => relic.id)
const seed = data.seed
const buildId = data.build_id
const gameMode = data.game_mode == 'standard' ? 'Single' : 'Multiplayer'
const time = new Date(totalSeconds * 1000).toLocaleString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const acts = data.acts
const amountOfActsPlayed = data.map_point_history.length

const hasMultipleActs = data.map_point_history.length >= 2
const floors = hasMultipleActs 
  ? data.map_point_history.flat().length 
  : data.map_point_history[0]?.length || 0

const lastActIndex = amountOfActsPlayed - 1
const lastActHistory = data.map_point_history[lastActIndex]
const lastMapPlayed = lastActHistory[lastActHistory.length - 1]
const gold = lastMapPlayed.player_stats[0].current_gold
const hp = lastMapPlayed.player_stats[0].current_hp
const maxHp = lastMapPlayed.player_stats[0].max_hp

</script>

<template>
    <ul>
        <li>{{ acts }}</li>
    </ul>


<h2>Game Information</h2>

<ul>
    <li>Character: {{ character }}</li>
    <li>Run Duration: {{ runTime }}</li>
    <li>Victory: {{ victory }}</li>
    <li>{{ time }}</li>
    <li>Seed: {{ seed }}</li>
    <li>Singleplayer: {{ gameMode }}</li>
    <li>Build: {{ buildId }}</li>
    <li>Floors: {{ floors }}</li>
    <li>Potions Remaining: {{ potions }}</li>
    <li>Gold: {{ gold }}</li>
    <li>{{ hp }}/{{ maxHp }}</li>
</ul>

<h2>Cards ({{ deck.length }})</h2>

    <div class="deck-container">
        <div v-for="card in deck">
            <b v-if="card.current_upgrade_level == 1">{{ card.id }}</b>
            <p v-else>{{ card.id }}</p>
        </div>
    </div>

<h2>Relics ({{ relics.length }})</h2>
    <div class="relic-container">
        <div v-for="relic in relics">
            <p>{{ relic }}</p>
        </div>
    </div>

</template>

<style>
* {
  font-family: sans-serif;
}

.deck-container,
.relic-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
    padding: 10px;
}

.deck-container > div,
.relic-container > div{
    border: 1px solid;
}

</style>

