/* 
    Created on : 20/02/2019 16:19:11
    Author     : William Santos
*/

"use strict";

//---------------------------------------------------------------------------------------//
// PARAMETERS

// Parameters
let anagrams = [];
let rejected = 0;
let intervalID = null;

// Elements
let btnGenerator = null;
let spanProgress = null;
let btnStop = null;
let divOutput = null;
let pRejected = null;

//---------------------------------------------------------------------------------------//
// HELPER FUNCTIONS

window.addEventListener ("load", function ()
{
    spanProgress = document.querySelector ("#progress span");
    btnStop = document.getElementById ("stop");
    divOutput = document.getElementById ("output");
    pRejected = document.getElementById ("rejected");
    let input = document.getElementById ("word");
    btnGenerator = document.getElementById ("generator");

    // EVENTS

    input.addEventListener ("keyup", function (e)
    {
        spanProgress.textContent = (this.value.length > 1 ? "Click on 'GENERATE'" : "Two or more letters (words)");
        divOutput.innerHTML = "";
        btnStop.style.display = "none";
        btnGenerator.disabled = false;

        if (typeof (intervalID) === "number") { clearInterval (intervalID); }
    });

    btnGenerator.addEventListener ("click", function (e)
    {
        if (input.value.length > 1) 
        {
            generateAnagrams (input.value);
            this.disabled = true;
            divOutput.innerHTML = "";
        }
    });

    btnStop.addEventListener ("click", function (e)
    {
        if (typeof (intervalID) === "number") 
        {
            clearInterval (intervalID);
            this.style = "none";
            rejected = 0;
            anagrams = [];
            btnGenerator.disabled = false;
        }
    });
});

function factorial (number)
{
    if (number === 1) { return 1; }
    return number * factorial (number - 1);
}

/**
 * Generates the number of max ocorrences based on word
 * @param {String} word 
 */
function generateMaxOcorrences (word)
{
    let maxOcorrences = 1;

    word = word.normalize ("NFD");
    word = word.replace (/[\u0300-\u036f]/g, "");
    let letters = word.split ("");
    let repeated = {};

    // Passing letters to object
    letters.map ((item) => 
    {
        if (item !== "")
        {
            let ocorrence = letters.filter ((letter) => letter === item).length;
            repeated[item] = ocorrence;
        }
    });

    // Calculates
    if (Object.keys (repeated).length > 1)
    {
        let values = Object.values (repeated);
        let totalRepeated = 1;
        values.map ((item, index) =>  { totalRepeated *= factorial (item); });
        maxOcorrences = factorial (word.length) / totalRepeated;
    }
    
    return maxOcorrences;
}

/**
 * Generates anagrams based on the word passed
 * @param {String} word 
 */
function generateAnagrams (word)
{
    anagrams = [];
    let start = Date.now ();

    // Initial parameters
    let letters = word.split ("");
    let maxOcorrences = generateMaxOcorrences (word);
    let arrInt = [];

    // Fills the array of integers
    letters.map ((item, index) => { arrInt.push (index); });

    // Shows the sop button
    btnStop.style.display = "inline-block";

    let index = 0;
    intervalID = setInterval (function ()
    {
        let newWord = [];
        let newIntegers = [];

        for (let j = 0; j < letters.length; j++) 
        {
            if (newWord.length === letters.length) { break; }

            // Generates random index e get value / integer from arrays
            let randomIndex = Math.ceil (Math.random () * letters.length) - 1;
            let letter = letters[randomIndex];
            let integer = arrInt[randomIndex];

            if (newIntegers.indexOf (integer) === -1) 
            {
                newIntegers.push (integer);
                newWord.push (letter);
            }
            else { j--; }
        }

        newWord = newWord.join ("");

        // Inserts into anagrams and renders it to screen
        if (anagrams.indexOf (newWord) == -1)
        {
            anagrams.push (newWord);
            renderElement (word, newWord, divOutput);
            spanProgress.innerHTML = `Generated <b> ${anagrams.length} </b> of possible ${maxOcorrences} anagrams...`;
            index++;
        }
        else
        {
            rejected++;
            pRejected.innerHTML = `<span> Duplicates Rejected : <b> ${rejected} </b> </span>`
            index--;
        }
        
        // Breaks
        if (anagrams.length === maxOcorrences) { index = maxOcorrences; }
        if (index === maxOcorrences)
        {
            clearInterval (intervalID);
            btnStop.style.display = "none";
            var finished = Date.now ();
            spanProgress.innerHTML = `Generated ${anagrams.length} anagram${anagrams.length > 1 ? "s" : ""} in <b> ${finished - start} ms </b>!`;
            rejected = 0;
            anagrams = [];
            btnGenerator.disabled = false;
        }
    });
}

/**
 * Create a new paragraph and appends to div
 * @param {String} word
 * @param {String} newWord
 * @param {Element} parent 
 */
function renderElement (word, newWord, parent)
{
    let paragraph = document.createElement ("p");
    paragraph.setAttribute ("class", (newWord === word ? "result same" : "result"));
    paragraph.textContent = newWord;
    parent.appendChild (paragraph);
}