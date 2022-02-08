import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import axios from 'axios';
import { createSpinner } from 'nanospinner';

// Save an internal reference to the player object
// This is initialized in startGame() function
let player;

// A helper function to delay a computing
export const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

// Welcome message
export const welcome = async () => {

    // Show the title
    const rainbowTitle = chalkAnimation.rainbow(
        'Who wants to be a JavaScript Millionaire?\n'
    );

    // Sleep a bit (non-blocking)
    await sleep();

    // Stop animating title
    rainbowTitle.stop();

    // Display how to play message
    console.log(`
    ${chalk.bgBlue('HOW TO PLAY')} 
    I am a process on your computer.
    If you get any question wrong I will be ${chalk.bgRed('killed')}
    So get all the questions right...
  `);
}

// Ask-for-name message
export const askName = async () => {

    // Prompt user for name
    const answers = await inquirer.prompt(
        {
            name: 'player_name',
            type: 'input',
            message: 'What is your name?',
            default: () => 'Player'
        }
    );

    return answers.player_name;
}

// Get the questions
const getQuestions = async () => {
    // Initialize request option
    const options = {
        hostname: 'javascript-quiz-server.herokuapp.com',
        path: '/questions',
        port: 443,
        method: 'GET',
    };

    // Send a GET request to server
    let response = await axios.get('https://javascript-quiz-server.herokuapp.com/questions');

    // Extract the body (auto-parsed JSON)
    return response.data.questions;
}

// Handle answer
const handleAnswer = async (isCorrect) => {

    // Create a spinner
    const spinner = createSpinner("Checking...").start();

    // Sleep a bit
    await sleep();

    if (isCorrect) {
        spinner.success({
            text: `Nice work ${player.playerName}. You do know JS!`
        });
    } else {
        spinner.error({ text: `💀💀💀 Game over, you lose ${player.playerName}!` });

        // Exit the game with code 1
        process.exit(1);
    }
}

// Show winner
const showWinner = () => {

    // Clear console
    console.clear();

    // Show message
    const msg = `Congrats, ${player.playerName}!`;

    // Use figlet to generate ASCII text
    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });
}


// Show a question
const showQuestion = async (questioInfo) => {
    const answers = await inquirer.prompt({
        name: "player_choice",
        type: 'list',
        message: questioInfo.question,
        choices: questioInfo.choices
    });

    // Handle the answer
    await handleAnswer(questioInfo.choices[questioInfo.correct_choice] === answers.player_choice);
}


// Start game 
export const startGame = async (playerInfo) => {

    // Initialize internal ref to player information
    player = playerInfo;

    // Get the questions
    let questions = await getQuestions();

    // Start the game
    for (let question of questions) {
        await showQuestion(question);
    }

    // If all questions are passed, show winner
    showWinner();
}