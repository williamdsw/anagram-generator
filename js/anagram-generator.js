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
let btnGenerator = null;
let spanProgress = null;
let btnStop = null;
let divOutput = null;
let pRejected = null;
let inputWord = null;

// HELPER FUNCTIONS

window.addEventListener ('load', function () {
    spanProgress = document.querySelector ('#pProgress span');
    btnStop = document.getElementById ('buttonStop');
    divOutput = document.getElementById ('divOutput');
    pRejected = document.getElementById ('pRejected');
    inputWord = document.getElementById ('inputWord');
    btnGenerator = document.getElementById ('btnGenerator');

    // EVENTS

    inputWord.addEventListener ('keyup', function () {
        spanProgress.textContent = (this.value.length > 1 ? `Click on 'GENERATE'` : 'Two or more letters (words)');
        divOutput.innerHTML = '';
        btnStop.style.display = 'none';
        btnGenerator.disabled = false;

        if (typeof (intervalId) === 'number') {
            clearInterval (intervalId); 
        }
    });

    btnGenerator.addEventListener ('click', function () {
        if (inputWord.value.length > 1) {
            generateAnagrams (inputWord.value);
            this.disabled = true;
            divOutput.innerHTML = '';
        }
    });

    btnStop.addEventListener ('click', function () {
        if (typeof (intervalId) === 'number') {
            clearInterval (intervalId);
            this.style = 'none';
            numberOfRejected = 0;
            anagrams = [];
            btnGenerator.disabled = false;
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
    const LETTERS = word.split ('');
    let repeated = {};

    // Passing letters to object
    LETTERS.map ((char) => {
        if (char !== '') {
            let ocorrence = LETTERS.filter ((c) => c === char).length;
            repeated[char] = ocorrence;
        }
    });

    // Calculates
    if (Object.keys (repeated).length > 1) {
        const VALUES = Object.values (repeated);
        let totalRepeated = 1;
        VALUES.map ((item, index) => totalRepeated *= factorial (item));
        maxOcorrences = (factorial (word.length) / totalRepeated);
    }
    
    return maxOcorrences;
}

// Generates anagrams based on the word passed
function generateAnagrams (word) {
    anagrams = [];
    const START = Date.now ();

    // Initial parameters
    const LETTERS = word.split ('');
    const MAX_OCORRENCES = generateMaxOcorrences (word);
    let arrInt = [];

    // Fills the array of integers
    LETTERS.map ((item, index) => arrInt.push (index));

    // Shows the sop button
    btnStop.style.display = 'inline-block';

    let index = 0;
    intervalId = setInterval (function () {
        let newWord = [];
        let newIntegers = [];

        for (let j = 0; j < LETTERS.length; j++) {
            if (newWord.length === LETTERS.length) {
                break; 
            }

            // Generates random index e get value / integer from arrays
            const RANDOM_INDEX = Math.ceil (Math.random () * LETTERS.length) - 1;
            let letter = LETTERS[RANDOM_INDEX];
            let integer = arrInt[RANDOM_INDEX];

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
            spanProgress.innerHTML = `Generated <b> ${anagrams.length} </b> of possible ${MAX_OCORRENCES} anagrams...`;
            index++;
        }
        else {
            numberOfRejected++;
            pRejected.innerHTML = `<span> Duplicates Rejected : <b> ${numberOfRejected} </b> </span>`
            index--;
        }
        
        // Breaks
        if (anagrams.length === MAX_OCORRENCES) {
            index = MAX_OCORRENCES; 
        }

        if (index === MAX_OCORRENCES) {
            clearInterval (intervalId);
            btnStop.style.display = 'none';
            const FINISHED = Date.now ();
            spanProgress.innerHTML = `Generated ${anagrams.length} anagram${anagrams.length > 1 ? "s" : ""} in <b> ${FINISHED - START} ms </b>!`;
            numberOfRejected = 0;
            anagrams = [];
            btnGenerator.disabled = false;
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