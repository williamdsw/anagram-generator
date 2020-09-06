/* 
    Created on : 20/02/2019 16:19:11
    Author     : William Santos
*/

"use strict";

// VARIABLES

// Parameters
let anagrams = [];
let numberOfRejected = 0;
let intervalId = null;

// Elements
let buttonGenerator = null;
let spanProgress = null;
let buttonStop = null;
let divOutput = null;
let pRejected = null;
let inputWord = null;

// HELPER FUNCTIONS

window.addEventListener ('DOMContentLoaded', () => {
    spanProgress = document.querySelector ('#pProgress span');
    buttonStop = document.querySelector ('#buttonStop');
    divOutput = document.querySelector ('#divOutput');
    pRejected = document.querySelector ('#pRejected');
    inputWord = document.querySelector ('#inputWord');
    buttonGenerator = document.querySelector ('#buttonGenerator');

    // EVENTS

    inputWord.addEventListener ('keyup', function () {
        spanProgress.textContent = (this.value.length > 1 ? `Click on 'GENERATE'` : 'Two or more letters (words)');
        divOutput.innerHTML = '';
        buttonStop.style.display = 'none';
        buttonGenerator.disabled = false;

        if (typeof (intervalId) === 'number') {
            clearInterval (intervalId); 
        }
    });

    buttonGenerator.addEventListener ('click', function () {
        if (inputWord.value.length > 1) {
            generateAnagrams (inputWord.value);
            this.disabled = true;
            divOutput.innerHTML = '';
        }
    });

    buttonStop.addEventListener ('click', function () {
        if (typeof (intervalId) === 'number') {
            clearInterval (intervalId);
            this.style = 'none';
            numberOfRejected = 0;
            anagrams = [];
            buttonGenerator.disabled = false;
        }
    });
});

function factorial (number) {
    if (number === 1) { 
        return 1; 
    }

    return number * factorial (number - 1);
}

/**
 * Generates the number of max ocorrences based on word
 * @param {String} word 
 */
function generateMaxOcorrences (word) {
    let maxOcorrences = 1;

    word = word.normalize ('NFD');
    word = word.replace (/[\u0300-\u036f]/g, '');
    const letters = word.split ('');
    let repeated = {};

    // Passing letters to object
    letters.map ((char) => {
        if (char !== '') {
            let ocorrence = letters.filter ((c) => c === char).length;
            repeated[char] = ocorrence;
        }
    });

    // Calculates
    if (Object.keys (repeated).length > 1) {
        const values = Object.values (repeated);
        let totalRepeated = 1;
        values.map ((item) => totalRepeated *= factorial (item));
        maxOcorrences = (factorial (word.length) / totalRepeated);
    }
    
    return maxOcorrences;
}

// Generates anagrams based on the word passed
function generateAnagrams (word) {
    anagrams = [];
    const start = Date.now ();

    // Initial parameters
    const letters = word.split ('');
    const maxOcorrences = generateMaxOcorrences (word);
    let arrInt = [];

    // Fills the array of integers
    letters.map ((item, index) => arrInt.push (index));

    // Shows the sop button
    buttonStop.style.display = 'inline-block';

    let index = 0;
    intervalId = setInterval (() => {
        let newWord = [];
        let newIntegers = [];

        for (let j = 0; j < letters.length; j++) {
            if (newWord.length === letters.length) {
                break; 
            }

            // Generates random index e get value / integer from arrays
            const randomIndex = Math.ceil (Math.random () * letters.length) - 1;
            let letter = letters[randomIndex];
            let integer = arrInt[randomIndex];

            if (newIntegers.indexOf (integer) === -1) {
                newIntegers.push (integer);
                newWord.push (letter);
            }
            else { 
                j--; 
            }
        }

        newWord = newWord.join ('');

        // Inserts into anagrams and renders it to screen
        if (anagrams.indexOf (newWord) == -1) {
            anagrams.push (newWord);
            renderElement (word, newWord, divOutput);
            spanProgress.innerHTML = `Generated <b> ${anagrams.length} </b> of possible ${maxOcorrences} anagrams...`;
            index++;
        }
        else {
            numberOfRejected++;
            pRejected.innerHTML = `<span> Duplicates Rejected : <b> ${numberOfRejected} </b> </span>`
            index--;
        }
        
        // Breaks
        if (anagrams.length === maxOcorrences) {
            index = maxOcorrences; 
        }

        if (index === maxOcorrences) {
            clearInterval (intervalId);
            buttonStop.style.display = 'none';
            const end = Date.now ();
            spanProgress.innerHTML = `Generated ${anagrams.length} anagram${anagrams.length > 1 ? "s" : ""} in <b> ${end - start} ms </b>!`;
            numberOfRejected = 0;
            anagrams = [];
            buttonGenerator.disabled = false;
        }
    });
}

// Create a new paragraph based on word and appends to div
function renderElement (word, newWord, parent) {
    let paragraph = document.createElement ('p');
    paragraph.setAttribute ('class', (newWord === word ? 'result same' : 'result'));
    paragraph.textContent = newWord;
    parent.appendChild (paragraph);
}