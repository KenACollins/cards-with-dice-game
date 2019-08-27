# 'Shut the Box' Game
This web application is an implementation of the 'Shut the Box' game described here:

https://en.wikipedia.org/wiki/Shut_the_Box

In summary, you roll dice and flip over nine cards until there are none left face up.

## How to Play
When you first launch the game, you are presented two dies, nine cards, and three buttons. 

The dice have not yet been rolled so they display initial values of '-'. The cards are numbered 1 through 9 with all appearing face up. The buttons are labeled 'Roll Dice', 'End Turn', and 'Start New Game'.

Click the 'Roll Dice' button. The dice will animate spinning and then settle down quickly, displaying numeric values from 1-6 each. Add them up, then flip over cards that match this total. For example, if you rolled a 4 and a 5 you would have a total of 9. You would then flip over any combination of card(s) that add up to 9. Possibilities are: the 9 card itself, 1 and 8 cards, 2 and 7 cards, 3 and 6 cards, or 4 and 5 cards. 

Once you have made your selections, end the round by clicking the 'End Turn' button. Then start a new round by clicking the 'Roll Dice' button.

Once you’ve flipped over all the cards or are unable to flip over any more cards to match dice totals, the game is over.

Note: When the sum of the remaining cards is less than or equal to 6 (the maximum value of a single die), only one die is available to roll.

## Try It Out!
Launch https://www.kenacollins.com/shut-the-box in your web browser. 

## Specifications

### Functional Spec

The application implements the 'Shut the Box' game, described in great detail at the aforementioned Wikipedia page, but for our purposes 
utilizes a set of up to two dies, nine numbered cards, and provides the means for rolling the dice and ending a turn. Optionally, a button
to start a new game can be provided.

Required to be playable:
* Dice numbers are updated on roll.
* One dice roll per turn. Player cannot keep rolling dice until the total is in his or her favor before flipping cards.
* Cards are flippable.
* Math is checked when a player flips cards and ends each turn, ensuring invalid card flips are prevented.
* Determine whether player wins or loses when game is over.

### Technical Spec

The front‐end is implemented using a standard client-side web stack comprising HTML5, CSS3, and JavaScript. Use of third party
libraries and frameworks is strictly limited, with React, Angular, and Vue on the 'do not use!' list.

### Extra Credit Items
Bonus points are granted for inclusion of the following features:

* Determine whether player is out of moves on the roll before he/she ends turn.
* Determine win/loss automatically.
* Show off some polished animations and/or styles.

### Design

The game's source code comprises only three files, one of each: HTML, CSS, and JavaScript. This is a single page application and all DOM manipulation is done in the JavaScript source code.

Some cool CSS is employed to enable the animated three-dimensional card flipping.

Comments in each source file provide additional details on the inner workings of the code.

### Third Party Frameworks

None.

Absolutely no third party libraries or frameworks were used:

* HTML5 - The sole HTML5 launch page, index.html, was hand coded from scratch.
* CSS3 - The CSS3 is all customized and residing in a single stylesheet, custom.css. There are no inline styles. No third party CSS libraries were used. The three buttons were coded from scratch.
* JavaScript - ES6+ features were used and all the code is pure vanilla JavaScript, including the DOM building and manipulation. No React, Angular, Vue, or even jQuery was used.

### Third Party Tools

None.