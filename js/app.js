/*
 * Create a list that holds all of your cards
 */
let openCards = [];


//loads all the cards into an array that will be shuffled later
function loadDeckArray() {
    const deck = document.querySelector('.deck');
    let deckArray = [];

    while (deck.firstElementChild) {
        deckArray.push(deck.firstElementChild);
        deck.removeChild(deck.firstElementChild);
    }

    return deckArray;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//takes an array of shuffled card elements and loops through appending to the 
//deck parent element in the DOM
function rebuildDeck(shuffledDeck) {
    const domDeck = document.querySelector('.deck');

    for(let card of shuffledDeck) {
        domDeck.appendChild(card);
    }
}

function selectCard(event) {
    //if a card clicked in the deck
    if(event.target.nodeName === 'LI') {
        showCard(event);
    }
}

function showCard(event) {
    //flip a card if it's closed
    if (event.target.className === 'card') {
        event.target.className = 'card open show';

        checkMatch(event);
    }
}

//check to see if the just flipped card matches the currently flipped card
function checkMatch (event) {
        openCards.push(event.target);

    //if the last card in the array is currently opened, check for matches
    if(openCards[openCards.length - 1].className === 'card open show') {
        const firstCardType = openCards[openCards.length - 2].firstElementChild.className;
        const secondCardType = openCards[openCards.length - 1].firstElementChild.className;

        //if cards match
        if (firstCardType === secondCardType) {
            setMatched();
        }
        //if not, flip them back over and clear them from the openCards array
        else {
            setTimeout(clearOpened,300);
        }
    }
}

//set both cards in the openCards array to matched
function setMatched() {
    openCards[openCards.length - 2].className = 'card match';
    openCards[openCards.length - 1].className = 'card match';
}

//flip over and delete the last two cards from the array
function clearOpened() {
    openCards[openCards.length - 2].className = 'card';
    openCards[openCards.length - 1].className = 'card';
    
    openCards.splice(openCards.length - 2,2);
}

const shuffledDeck = shuffle(loadDeckArray());
rebuildDeck(shuffledDeck);

const deck = document.querySelector('.deck');
deck.addEventListener('click',selectCard);
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
