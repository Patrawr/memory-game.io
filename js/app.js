/*
 * Create a list that holds all of your cards
 */
let openCards = [];
let currentStars = [];
const moveCounter = document.querySelector('.moves');
let starCounter = 3;


//loads all the cards into an array that will be shuffled later
function loadDeckArray() {
    const deck = document.querySelector('.deck');
    let deckArray = [];
    deck.style.display = 'flex';

    while (deck.firstElementChild) {
        //initializing state of cards
        deck.firstElementChild.className = 'card';

        deckArray.push(deck.firstElementChild);
        deck.removeChild(deck.firstElementChild);
    }

    loadStars();
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

function loadStars() {
    let stars = document.querySelector('.stars').firstElementChild;
    currentStars = [];
    starCounter = 3;

    for (let i = 0; i < 3; i++) {
        stars.firstElementChild.className = 'fa fa-star';
        currentStars.push(stars.firstElementChild);
        stars = stars.nextElementSibling;
    } 
}

//handles the star rating
//20 - 2 Stars
//31 - 1 Stars
function checkRating() {
    if (moveCounter.textContent === "20") {
        currentStars[starCounter-1].className = 'fa fa-star-o';
        starCounter--;
    }
    else if (moveCounter.textContent === "31") {
        currentStars[starCounter-1].className = 'fa fa-star-o';
        starCounter--;
    }
}

//********************************************** */
//       MATCHING LOGIC
//********************************************** */
function selectCard(event) {
    //if a card clicked in the deck
    if(event.target.nodeName === 'LI') {
        //flip a card if it's closed
        if (event.target.className === 'card') {
            event.target.classList.add('open','show');

            incrementMoves();
            openCards.push(event.target);

            if (openCards.length >= 2) {
                checkMatch(event);    
            }
            
        }
    }
}


//check to see if the just flipped card matches the currently flipped card
function checkMatch (event) {
    //if the last two cards in the array are currently opened, check for matches
    if(openCards[openCards.length - 2].classList.contains('show') && 
       openCards[openCards.length - 1].classList.contains('show')) {
        const firstCardType = openCards[openCards.length - 2].firstElementChild.className;
        const secondCardType = openCards[openCards.length - 1].firstElementChild.className;

        //if cards match
        if (firstCardType === secondCardType) {
            setMatched();
        }
        //if not, flip them back over and clear them from the openCards array
        else {
            setTimeout(clearOpened,400);
        }
    }
}

//set both cards in the openCards array to matched
function setMatched() {
    openCards[openCards.length - 2].className = 'card match';
    openCards[openCards.length - 1].className = 'card match';

    //if there are 16 cards in the openCards array, then we have matched all cards
    if (openCards.length === 16) {
        setTimeout(resultsScreen(),600);
    }
}

//flip over and delete the last two cards from the array
function clearOpened() {
    openCards[openCards.length - 2].className = 'card';
    openCards[openCards.length - 1].className = 'card';
    
    openCards.splice(openCards.length - 2,2);
}

//*********************************************************** */
function incrementMoves() {
    moveCounter.textContent ++;
    checkRating();
}

function resultsScreen() {
    deck.style.display = 'none';
}

//reset the game state
function restartGame() {
    rebuildDeck(shuffle(loadDeckArray()));

    openCards = [];

    moveCounter.textContent = 0;
}

const shuffledDeck = shuffle(loadDeckArray());
rebuildDeck(shuffledDeck);

const deck = document.querySelector('.deck');
deck.addEventListener('click',selectCard);

const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click',restartGame);

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
