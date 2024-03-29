/*
 * Create a list that holds all of your cards
 */
let openCards = [];
let currentStars = [];
const moveCounter = document.querySelector('.moves');
let starCounter = 3;
let seconds = 0;
let timer = 0;
let matches = 0;

//loads all the cards into an array that will be shuffled later
function loadDeckArray() {
    const deck = document.querySelector('.deck');
    let deckArray = [];
    loadStars();

    while (deck.firstElementChild) {
        //initializing state of cards
        deck.firstElementChild.className = 'card';

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
        if (event.target.className === 'card' &&
            openCards.length < 2) {
            event.target.classList.add('open','show');

            if(seconds === 0 && timer < 1) {
                timer = setInterval(runTimer,1000);
            }

            incrementMoves();
            openCards.push(event.target);

            if (openCards.length === 2) {
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
            openCards = [];
        }
        //if not, flip them back over and clear them from the openCards array
        else {
            openCards[openCards.length - 2].classList.add('animated','shake');
            openCards[openCards.length - 1].classList.add('animated','shake'); 
            setTimeout(clearOpened,400);
        }
    }
}

//set both cards in the openCards array to matched
function setMatched() {
    openCards[openCards.length - 2].className = 'card match animated tada';
    openCards[openCards.length - 1].className = 'card match animated tada';

    matches++;

    //if there are 16 cards in the openCards array, then we have matched all cards
    if (matches >= 8) {
        setTimeout(resultsScreen,600);
    }
}

//flip over and delete the last two cards from the array
function clearOpened() {
    openCards[openCards.length - 2].className = 'card';
    openCards[openCards.length - 1].className = 'card';
    
    openCards = [];
}

//*********************************************************** */
function incrementMoves() {
    moveCounter.textContent ++;
    checkRating();
}

//displayed at end of game, outlining player performance
function resultsScreen() {
    deck.style.display = 'none';
    document.querySelector('.score-panel').style.display= 'none';
    document.querySelector('.results').style.display = 'flex';

    clearInterval(timer);

    const time = document.querySelector('.timer').textContent;

    const score = document.querySelector('.results-score');
    score.textContent = `You won with ${moveCounter.textContent} moves and ${starCounter} stars!!`;
    
    const resultTime = document.querySelector('.results-time');
    resultTime.textContent = `Playing time: ${time}`;
    
}

//reset the game state
function restartGame(event) {
    if(event.target.className = 'fa fa-repeat' || 'restart-button') {
        rebuildDeck(shuffle(loadDeckArray()));
        
        //show the deck,score panel if it's hidden
        deck.style.display = 'flex';
        document.querySelector('.score-panel').style.display= 'block';
        document.querySelector('.results').style.display = 'none';

        //resets the open cards
        openCards = [];
        moveCounter.textContent = 0;
        matches = 0;

        clearInterval(timer);
        //keeps track of timer
        timer = 0;
        seconds = 0;
        document.querySelector('.timer').textContent = '00:00:00';
    }
}

//runs on an interval, every second
//seconds is incremented ever second and below calculations convert to 
//hours, minutes days format
function runTimer() {
    seconds++;

    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    minutes = minutes - (hours * 60)
    let calcSeconds = seconds - ((hours * 3600) + (minutes * 60));

    //adds 0 padding to the left of the numbers so it appears in "clock" format
    //00:00:00
    let displaySeconds = calcSeconds.toString().padStart(2,"0");
    let displayMinutes = minutes.toString().padStart(2,"0");
    let displayHours = hours.toString().padStart(2,"0");

    document.querySelector('.timer').textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
}

//**************MAIN************************************ */
const shuffledDeck = shuffle(loadDeckArray());
rebuildDeck(shuffledDeck);

//main card click event
const deck = document.querySelector('.deck');
deck.addEventListener('click',selectCard);

//reset button in the top right during play
const resetButton = document.querySelector('.restart');
resetButton.addEventListener('click',restartGame);

//restart button on results screen
const restartButton = document.querySelector('.restart-button');
restartButton.addEventListener('click',restartGame);
