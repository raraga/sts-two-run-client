<script setup lang="ts">
import data from '../data/defect-first-victory.json'

const character = data.players[0]?.character?.split('.')[1]
const totalSeconds = data.start_time
const victory = data.win
const runTime = data.run_time / 60
const deck = data.players[0]!.deck.map((card) => card.id)
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

const amountOfActsPlayed = data.map_point_history.length //
</script>

<template>
  <ul>
    <li>Character: {{ character }}</li>
    <li>Deck: {{ deck }}</li>
    <li>Run Duration: {{ runTime }}</li>
    <li>Victory: {{ victory }}</li>
  </ul>

  <ul>
    <li>{{ time }}</li>
    <li>Seed: {{ seed }}</li>
    <li>Singleplayer: {{ gameMode }}</li>
    <li>{{ buildId }}</li>
  </ul>

  <ul>
    <li>{{ amountOfActsPlayed }}</li>
  </ul>
</template>

<style>
* {
  font-family: sans-serif;
}
</style>
