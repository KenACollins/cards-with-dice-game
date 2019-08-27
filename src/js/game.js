// ID Constants
const GAME_CONTAINER_ID = 'gameContainer';  // ID of the game container, not to be confused by the true root attached to body tag.
const DICE_CONTAINER_ID = 'diceContainer';
const CARDS_CONTAINER_ID = 'cardsContainer';
const BUTTONS_CONTAINER_ID = 'buttonsContainer';
const MESSAGE_CONTAINER_ID = 'messageContainer';
const DIE_ID_PREFIX = 'die';
const CARDS_ID_PREFIX = 'card';
const ROLL_DICE_BUTTON_ID = 'rollDice';
const END_TURN_BUTTON_ID = 'endTurn';
const START_GAME_BUTTON_ID = 'startGame';

// Headline and Button Labels
const DICE_HEADLINE = 'Dice';
const CARDS_HEADLINE = 'Cards';
const BUTTONS_HEADLINE = 'Control';
const ROLL_DICE_BUTTON_LABEL = 'Roll Dice';
const END_TURN_BUTTON_LABEL = 'End Turn';
const START_GAME_BUTTON_LABEL = 'Start New Game';

// Other Constants
const INITIAL_DIE_VALUE = '-';
const MIN_DIE_VALUE = 1;
const MAX_DIE_VALUE = 6;
const GAME_OVER_NOTIFICATION_DELAY_IN_MILLISECONDS = 3000;

class ShutTheBoxGame {
    constructor() {
        this.rootElement = this.establishRootElement();
        this.resetEnvironment();
    }
    
    establishRootElement() {
        const rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);
        return rootElement;
    }

    resetEnvironment() {
        this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.matchesArr = [];
        this.userSelections = [];
        this.showBothDice = true;
        this.isGameOver = false;
        this.buildGame();
    }

    buildGame() {
        // Delete previous game DOM elements before rebuilding, if applicable.
        const gameDom = document.getElementById(GAME_CONTAINER_ID);
        if (gameDom !== null) {
            gameDom.parentNode.removeChild(gameDom);
        }
        
        // Estabish top level container for our game module.
        const gameContainer = document.createElement('div');
        gameContainer.id = GAME_CONTAINER_ID;

        // Add dice, message, cards, and buttons to top level container.
        // Warning: Must check for null, appendChild() can't handle it!!!
        const diceDiv = this.buildDice();
        if (diceDiv !== null) { gameContainer.appendChild(diceDiv); }

        const msgDiv = this.buildMessageContainer();
        if (msgDiv !== null) { gameContainer.appendChild(msgDiv); }
        
        const cardsDiv = this.buildCards();
        if (cardsDiv !== null) { gameContainer.appendChild(cardsDiv); }
        
        const buttonsDiv = this.buildButtons();
        if (buttonsDiv !== null) { gameContainer.appendChild(buttonsDiv); }
        
        // Add top level container to the screen.
        this.rootElement.appendChild(gameContainer);
    }

    buildDice() {
        //==========
        // Container
        //==========
        let diceDiv = document.getElementById(DICE_CONTAINER_ID);
        if (diceDiv !== null) {
            this.removeAllChildren(diceDiv);    // Delete previous dice child nodes before rebuilding.
        }
        else {
            diceDiv = document.createElement('div');
            diceDiv.id = DICE_CONTAINER_ID;
        }

        //=========
        // Headline
        //=========
        const headline = document.createElement('h4');
        const headlineText = document.createTextNode(DICE_HEADLINE);
        headline.appendChild(headlineText);
        diceDiv.appendChild(headline);

        //==========
        // First Die
        //==========
        this.die1 = INITIAL_DIE_VALUE;
        const die1 = document.createElement('div');
        die1.id = `${DIE_ID_PREFIX}1`;
        die1.classList.add('die');
        const die1Text = document.createTextNode(this.die1);
        die1.appendChild(die1Text);
        diceDiv.appendChild(die1);

        //===========
        // Second Die
        //===========
        this.die2 = INITIAL_DIE_VALUE;
        if (this.showBothDice) {
            const die2 = document.createElement('div');
            die2.id = `${DIE_ID_PREFIX}2`;
            die2.classList.add('die');
            const die2Text = document.createTextNode(this.die2);
            die2.appendChild(die2Text);
            diceDiv.appendChild(die2);
        }

        //==================
        // Return to caller.
        //==================
        return diceDiv;
    }

    buildCards() {
        //==========
        // Container
        //==========
        let cardsDiv = document.getElementById(CARDS_CONTAINER_ID);
        if (cardsDiv !== null) {
            this.removeAllChildren(cardsDiv);    // Delete previous cards child nodes before rebuilding.
        }
        else {
            cardsDiv = document.createElement('div');
            cardsDiv.id = CARDS_CONTAINER_ID;
        }

        // We could add a click event listener to each card, but that would result in nine of them.
        // A more efficient approach is to attach a single click event listener to the parent container
        // of the cards and then detect the clicked 'frontFace' or 'backFace' div based on event.target.        
        cardsDiv.addEventListener('click', event => this.flipCard(event.target));   // Clicked div is front or back face, not its parent card div.

        //=========
        // Headline
        //=========
        const headline = document.createElement('h4');
        const headlineText = document.createTextNode(CARDS_HEADLINE);
        headline.appendChild(headlineText);
        cardsDiv.appendChild(headline);

        //======
        // Cards
        //======
        for (let i = 0; i < this.cards.length; i++) {
            // Parent card.
            const card = document.createElement('div');
            card.id = `${CARDS_ID_PREFIX}${this.cards[i]}`;
            card.classList.add('card');

            // Child front face div.
            const frontFace = document.createElement('div');
            frontFace.classList.add('frontFace');
            const cardText = document.createTextNode(this.cards[i]);
            frontFace.appendChild(cardText);

            // Child back face div.
            const backFace = document.createElement('div');
            backFace.classList.add('backFace');

            // Insert back face, then front face. Last one 'wins' and is what we initially see.
            card.appendChild(backFace);
            card.appendChild(frontFace);
            cardsDiv.appendChild(card);
        }

        //==================
        // Return to caller.
        //==================
        return cardsDiv;
    }

    buildButtons() {
        //==========
        // Container
        //==========
        let buttonsDiv = document.getElementById(BUTTONS_CONTAINER_ID);
        if (buttonsDiv !== null) {
            this.removeAllChildren(buttonsDiv);    // Delete previous buttons child nodes before rebuilding.
        }
        else {
            buttonsDiv = document.createElement('div');
            buttonsDiv.id = BUTTONS_CONTAINER_ID;
        }

        // We could add a click event listener to each button, but that would result in four of them.
        // A more efficient approach is to attach a single click event listener to the parent container
        // of the buttons and then detect the button that has been clicked based on event.target.id.
        buttonsDiv.addEventListener('click', event => this.processButtonClicks(event.target.id)); 

        //=========
        // Headline
        //=========
        const headline = document.createElement('h4');
        const headlineText = document.createTextNode(BUTTONS_HEADLINE);
        headline.appendChild(headlineText);
        buttonsDiv.appendChild(headline);
        
        //=================
        // Roll Dice Button
        //=================
        const rollDiceButton = document.createElement('button');
        rollDiceButton.id = ROLL_DICE_BUTTON_ID;
        const rollDiceButtonText = document.createTextNode(ROLL_DICE_BUTTON_LABEL);
        rollDiceButton.appendChild(rollDiceButtonText);
        buttonsDiv.appendChild(rollDiceButton);

        //================
        // End Turn Button
        //================
        const endTurnButton = document.createElement('button');
        endTurnButton.id = END_TURN_BUTTON_ID;
        const endTurnButtonText = document.createTextNode(END_TURN_BUTTON_LABEL);
        endTurnButton.appendChild(endTurnButtonText);
        buttonsDiv.appendChild(endTurnButton);

        //======================
        // Start New Game Button
        //======================
        const startGameButton = document.createElement('button');
        startGameButton.id = START_GAME_BUTTON_ID;
        const startGameButtonText = document.createTextNode(START_GAME_BUTTON_LABEL);
        startGameButton.appendChild(startGameButtonText);
        buttonsDiv.appendChild(startGameButton);

        //==================
        // Return to caller.
        //==================
        return buttonsDiv;
    }

    buildMessageContainer() {
        //==========
        // Container
        //==========
        let msgDiv = document.getElementById(MESSAGE_CONTAINER_ID);
        if (msgDiv !== null) {
            this.updateMessage();   // Clear message if present by not passing a message ID parameter.
        }
        else {
            msgDiv = document.createElement('div');
            msgDiv.id = MESSAGE_CONTAINER_ID;
        }

        //==================
        // Return to caller.
        //==================
        return msgDiv;
    }

    /**
     * Displays on-screen message based on an ID. If no ID is passed, on-screen message will be cleared.
     * @param {String} msgId - ID of the canned message to be shown.
     */
    updateMessage(msgId) {
        const msgDiv = document.getElementById(MESSAGE_CONTAINER_ID);
        if (!msgId) {
            msgDiv.textContent = '';
            return;
        }

        let message;
        switch(msgId) {
            case '1': message = `No valid button was clicked.`; break;
            case '2': message = `GAME OVER: No matches are possible. You may click 'Start New Game'.`; break;
            case '3': message = `NO SELECTIONS? You cannot end your turn until you have flipped over one or more numeric cards whose combined face values add up to the current dice roll of ${this.die1 + this.die2}.`; break;
            case '4': message = `NO DICE? You cannot end your turn until you have rolled the dice and flipped over one or more numeric cards whose combined face values add up to that dice roll.`; break;
            case '5': message = `Congratulations! You have successfully shut the box by flipping over all nine numbered cards! Game is over. You may click 'Start New Game'.`; break;
            case '6': message = `Nice job! Click the 'Roll Dice' button for another turn.`; break;
            case '7': message = `BAD CHOICES: Your selection(s) of ${this.userSelections.toString()} do not add up to the current dice roll sum of ${this.die1 + this.die2}. Please try again.`; break;
            default: message = `BAD MESSAGE ID: ${msgId}.`;
        }

        msgDiv.textContent = message;
    }

    /**
     * Central place for handling button clicks except for disabling/enabling.
     * @param {String} buttonId - 'rollDice', 'endTurn', or 'startGame'
     */
    processButtonClicks(buttonId) {
        // Clear on-screen message, if any.
        this.updateMessage();

        switch (buttonId) {
            case ROLL_DICE_BUTTON_ID:
                this.rollDice();
                break;
            case END_TURN_BUTTON_ID:
                this.checkUserSelections();
                break;
            case START_GAME_BUTTON_ID:
                 this.resetEnvironment();
                 break;
            default: this.updateMessage('1');   // Not a valid button message occurs if user clicks inside button container but not on a button.
        }
    }

    /**
     * Disables button based on ID so that it cannot be clicked.
     * @param {String} buttonId - 'rollDice', 'endTurn', or 'startGame' 
     */
    disableButton(buttonId) {
        const button = document.getElementById(buttonId);
        button.setAttribute('disabled', 'disabled');
        button.classList.add('disabledButton');
    }

    /**
     * Enables button based on ID, restoring its ability to be clicked.
     * @param {String} buttonId - 'rollDice', 'endTurn', or 'startGame' 
     */
    enableButton(buttonId) {
        const button = document.getElementById(buttonId);
        button.removeAttribute('disabled');
        button.classList.remove('disabledButton');
    }

    /**
     * When the game is over, disable the 'Roll Dice' and 'End Turn' buttons.
     * Set flag that will prevent user from flipping remaining cards.
     */
    gameOver() {
        this.disableButton(ROLL_DICE_BUTTON_ID);
        this.disableButton(END_TURN_BUTTON_ID);
        this.isGameOver = true;
    }

    /**
     * Processes 'Roll Dice' button click, causing dice to physically spin while being set to
     * random values in range of 1 to 6.
     */
    rollDice() {
        // Get handles to the dice.
        const die1Elem = document.getElementById(`${DIE_ID_PREFIX}1`);
        const die2Elem = document.getElementById(`${DIE_ID_PREFIX}2`);
        
        // Animate the dice as their values change.
        die1Elem.classList.add('roll');
        if (die2Elem !== null) { die2Elem.classList.add('roll'); }
        
        // Use random number generator to set dice values between 1 and 6.
        let dieValue = Math.floor(Math.random() * MAX_DIE_VALUE) + MIN_DIE_VALUE;
        this.die1 = dieValue;
        die1Elem.textContent = dieValue;
        if (die2Elem !== null) {
            dieValue = Math.floor(Math.random() * MAX_DIE_VALUE) + MIN_DIE_VALUE;
            this.die2 = dieValue;
            die2Elem.textContent = dieValue;
        }
        else {
            this.die2 = 0;
        }

        // Disable 'Roll Dice' button so user cannot roll again without flipping cards.
        this.disableButton(ROLL_DICE_BUTTON_ID);
        
        // Calculate all possible matches.
        this.matchesArr = this.findAllMatches(this.die1 + this.die2);

        // If this is the end of the line for the user's game, immediately disable 'Roll Dice' and 'End Turn' buttons
        // and prevent user from flipping any of the remaining cards. However, wait for dice roll animation
        // to complete and give user a moment to think before displaying a message declaring that the game is over.
        if (this.matchesArr.length === 0) {
            this.gameOver();
            setTimeout(() => {
                this.updateMessage('2');    // Premature game over message.
            }, GAME_OVER_NOTIFICATION_DELAY_IN_MILLISECONDS);                
        }
    }

    /**
     * This method kicks in after the user has rolled the dice, flipped over cards, and has clicked the 'End Turn' button.
     * If the user's card selections satisfy the criteria of the dice roll, the system enables another turn, unless all 
     * cards have been flipped over, in which case the user is congratulated and encouraged to begin a new game.
     */
    checkUserSelections() {
        // Track the numeric values of all cards that were flipped over by the user during the current turn.
        const cardsFlippedThisTurn = document.querySelectorAll('.card.flip:not([disabled])');   // Ignore flipped, disabled cards from prior turn.
        cardsFlippedThisTurn.forEach(card => this.userSelections.push(this.getNumberFromId(card.id)));

        // Sort the user's selections so we can later compare to sorted combinations stored in this.matchesArr array.
        this.userSelections.sort();

        if (this.userSelections.length === 0) {
            let msgId = '3';    // No selections message.
            if (this.diceNotRolled()) {
                msgId = '4';    // No dice message.
            }
            this.updateMessage(msgId);
            return;
        }

        // If the user's selections match a valid combination based on the current dice roll...
        if (this.isArrayInArray(this.matchesArr, this.userSelections)) {
            // Disable the cards so they remain face down and unclickable in a future turn.
            // cardsFlippedThisTurn.forEach(card => card.disabled = true);
            cardsFlippedThisTurn.forEach(card => card.setAttribute('disabled', 'disabled'));

            // Remove user selections from the remaining cards array.
            this.userSelections.forEach(cardValue => {
                const foundIndex = this.cards.indexOf(cardValue);   // Guaranteed to be found, no need to check for -1.
                this.cards.splice(foundIndex, 1);
            });

            // If no cards remain face up, declare winner!
            if (this.cards.length === 0) {
                this.updateMessage('5');    // Congratulations message.
                this.gameOver();
            }
            // Otherwise, prepare for another turn.
            else {
                // Calculate if next turn requires one or two dice.
                const sumOfRemainingCardValues = this.cards.reduce((sum, num) => sum + num);
                if (sumOfRemainingCardValues <= MAX_DIE_VALUE) {
                    this.showBothDice = false;
                }

                // Rebuild the dice.
                this.buildDice();
                
                // Enable 'Roll Dice' button.
                this.enableButton(ROLL_DICE_BUTTON_ID);

                // Congratulate user on a nice move.
                this.updateMessage('6');
            }
        }
        // Otherwise, user has flipped cards that do not satisfy the criteria of current dice roll.
        else {
            // Display error message and flip selected cards back face up.
            this.updateMessage('7');
            cardsFlippedThisTurn.forEach(card => card.classList.remove('flip'));
        }

        // Whether next step is another turn or another attempt, clear user's selections.
        this.userSelections.splice(0, this.userSelections.length);
    }

    /**
     * For the clicked front or back face card that is on top, add or remove 'flip' class to its parent 
     * card div to cause card to flip face down or restore face up, respectively. But skip this step if: 
     * (A) user has not yet rolled the dice, or (B) card was successfully flipped over in a previous turn.
     * @param {HTMLElement} faceCard - Div with class 'frontFace' or 'backFace' which is currently on top.
     */
    flipCard(faceCard) {
        // Do not allow card flip if game has prematurely ended due to dice roll. Do this before clearing 
        // message, as we want to ensure that the game over message persists on-screen.
        if (this.isGameOver) { return; }

        // Clear on-screen message, if any.
        this.updateMessage();

        // Do not allow card flip if user has not yet rolled the dice in the current turn.
        if (this.diceNotRolled()) { return; }
        
        // The click event fires for the card div on top which is one of the child divs with 'frontFace'
        // or 'backFace' class. To access the div with 'card' class we need to get parent element.
        const parentCard = faceCard.parentElement;
        
        // If card was flipped in a prior turn, do not flip it. We need to explicitly check this condition
        // because the disabled attribute only ignores clicks on standard form input elements and buttons.
        // Therefore, clicking on a div with disabled attribute does not stop code from running THIS callback.
        if (parentCard.hasAttribute('disabled')) { return; }
        
        // Add 'flip' class to card div to flip it face down. Remove 'flip' class to flip it face up.
        parentCard.classList.toggle('flip');
    }

    /**
     * Returns true if user has not yet rolled the dice in the current turn. False otherwise.
     * This check is meant to prevent user from flipping cards before rolling the dice.
     */
    diceNotRolled() {
        return this.die1 === INITIAL_DIE_VALUE && this.die2 === INITIAL_DIE_VALUE;
    }

    /**
     * For the current numeric cards at play, calculates all possible combinations of one, two, or three numbers whose sums
     * equal that of the sum total of the rolled dice. Example: If the dice roll is 4 and 5, this totals 9. If all nine cards
     * are at play (meaning none have been flipped over by the user in a prior turn), then the following matches are possible:
     * [1,8], [2,7], [3,6], [4,5], [9]. Matches are sorted to avoid duplicates since [3,6] is the same as [6,3].
     * @param {Number} dieSum - Sum of the face values of both dice, or just the value of the first die if only one is present.
     */
    findAllMatches(dieSum) {
        let matchesArr = [];    // Define locally and pass back result to instance variable of same name.

        // Single card match.
        if (this.cards.includes(dieSum)) {
            let matchArr = [];
            matchArr.push(dieSum);      // Even a single value needs to be placed inside array so isArrayInArray() works.
            matchesArr.push(matchArr);
        }

        // Two cards match.
        for (let i=0; i < this.cards.length; i++) {
            for (let j=i+1; j < this.cards.length; j++) {
                if (this.cards[i] + this.cards[j] === dieSum) {
                    let matchArr = [];
                    matchArr.push(this.cards[i]);
                    matchArr.push(this.cards[j]);
                    matchesArr.push(matchArr.sort());   // Default sort() only works on numbers with the same number of digits.
                }
            }
        }

        // Three cards match.
        for (let i=0; i < this.cards.length; i++) {
            for (let j=i+1; j < this.cards.length; j++) {
                for (let k=j+1; k < this.cards.length; k++) {
                    if (this.cards[i] + this.cards[j] + this.cards[k] === dieSum) {
                        let matchArr = [];
                        matchArr.push(this.cards[i]);
                        matchArr.push(this.cards[j]);
                        matchArr.push(this.cards[k]);
                        matchesArr.push(matchArr.sort());
                    }
                }
            }
        } 
    
        return matchesArr;
    }

    /** UTILITY METHODS BELOW - Ideally should be placed in a separate library, not doing so in order to keep all JS code in one file. */
    /**
     * For a given DOM element, removes all its child nodes.
     * @param {HTMLElement} domElement 
     */
    removeAllChildren(domElement) {
        while (domElement.firstChild) {
            domElement.removeChild(domElement.firstChild);
        }
    }

    /**
     * For DOM element IDs consisting of a string followed by a number that corresponds to the 
     * value of the selected card, extract the number. For example, if passed an ID of 'card7'
     * this method will return 7 as a number.
     * @param {String} id 
     */
    getNumberFromId(id) {
        return new Number(id.replace(/\D/g, '')).valueOf();
    }

    /**
     * Searches an array whose elements are arrays seeking to find if one of those elements 
     * exactly matches an individual array. Be careful of single elements, comparison must be 
     * exact. Compare/contrast Examples 2 and 3. 
     * Example 1: Searching for [1,2] within [ [1,2] , [3,4] ] returns true.
     * Example 2: Searching for [8] within [ [1,2] , [3,4], [8] ] returns true.
     * Example 3: Searching for 8 within [ [1,2] , [3,4], [8] ] returns false.
     * @param {Array} arrayOfArrays 
     * @param {Array} individualArray 
     */
    isArrayInArray(arrayOfArrays = [], individualArray = []) {
       const flattenedArrayOfArrays = JSON.stringify(arrayOfArrays);
       const flattenedArray = JSON.stringify(individualArray);

       if (flattenedArrayOfArrays.indexOf(flattenedArray) !== -1) {
           return true;
       }
       return false;
    }
}

new ShutTheBoxGame();