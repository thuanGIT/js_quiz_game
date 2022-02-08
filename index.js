#!/usr/bin/env node

import { welcome, askName, startGame } from './utility.js';


// Global object to hold current quiz session
let player = {
    playerName: "Player"
};


// Run welcome message (top-level await supported)
await welcome();


// Ask for name
player.playerName = await askName();


// Start game
await startGame(player);
