Ext.define('Checkers.controller.Game', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            board: {
                select: 'doSelect'
            }
        },
        refs: {
            board: 'main dataview'
        },
        /* These next two are custom variables that we use. */
        previousTurn: {
            player: null,
            moves: []
        },
        currentTurn: {
            player: 'red',
            piece: null,
            moves: [],
            removedPieces: [],
            endOfTurn: false,
            hasJumped: false
        }
    },
    doSelect: function (view, record) {
        var turn = this.getCurrentTurn();
        /* Select is preventable. If the move is illegal, we will return false to prevent the selection. If it's a legal move, we will return true */

        /* If the turn has been marked as over, disallow selection */
        if (turn.endOfTurn) {
            return false;
        }
        
        /* Next we disallow selecting any light square. Only dark squares have pieces on them */
        if (record.get('background') == 'light') {
            return false;
        }

        /* Now, if we're at the start of the move (no moves made) we have to be a piece owned by the current player */
        if (turn.moves.length == 0 && record.get('occupiedBy') != turn.player) {
            return false;
        } else if (turn.moves.length == 0) {
            /* We've started our turn. We store moves in reverse order. The first move in the list is the last move made. */
            turn.moves.unshift(record);
            turn.piece = record;
            this.setCurrentTurn(turn);
            return true;
        } else if (this.isLegalMove(turn.moves[0], record)) {
            turn.moves.unshift(record);
            this.setCurrentTurn(turn);

            /* Now we need to decorate our board with arrows and such */
            this.decorateCurrentTurn();
            return true;
        } else {
            return false;
        }
    },
    isLegalMove: function (from, to) {
        var turn = this.getCurrentTurn(),
            fromID, toID, distance, intermediate;

        /*
         * We are implementing a simplified set of rules for Checkers here:
         *
         * 1. Is the destination empty?
         * 2. Is the destination one square away diagonally?
         * 3. If not 2, then is it two away with one opponent's piece in between?
         * 
         */
        
        /* First, is the destination empty? */
        if (to.get('occupiedBy') != 'none') {
            return false;
        }

        fromID = from.get('squareID').split('');
        toID = to.get('squareID').split(''); // This makes the letter element 0, and the number element 1.

        distance = Math.abs(toID[1] - fromID[1]);

        /* Next, are we one away and not coming off of a jump? */
        if (distance == 1 && !turn.hasJumped) {
            if (turn.piece.get('pieceType') == 'King') {
                console.log('King moving');
                console.log('Checking if '+toID[0]+' is either '+this.nextLetter(fromID[0])+' or '+this.previousLetter(fromID[0]));
                if (toID[0] == this.nextLetter(fromID[0])) {
                    this.setEndOfTurn();
                    return true;
                } else if (toID[0] == this.previousLetter(fromID[0])) {
                    this.setEndOfTurn();
                    return true;
                }
                console.log('It is not.');
                /* We can move in any of four directions */
            } else if (turn.piece.get('occupiedBy') == 'red') {
                console.log('Red moving');
                /* Regular red pieces can move up */
                console.log('Testing if '+toID[1]+' == '+fromID[1]+' - 1');
                if (toID[1] < fromID[1]) {
                    console.log('It does!');
                    console.log('Checking if '+toID[0]+' is either '+this.nextLetter(fromID[0])+' or '+this.previousLetter(fromID[0]));
                    if (toID[0] == this.nextLetter(fromID[0])) {
                        this.setEndOfTurn();
                        return true;
                    } else if (toID[0] == this.previousLetter(fromID[0])) {
                        this.setEndOfTurn();
                        return true;
                    }
                    console.log('It is not.');
                }
            } else {
                console.log('Black moving');
                /* Regular black pieces can move down */
                console.log('Testing if '+toID[1]+' == '+fromID[1]+' + 1');
                if (toID[1] > fromID[1]) {
                    console.log('It does!');
                    console.log('Checking if '+toID[0]+' is either '+this.nextLetter(fromID[0])+' or '+this.previousLetter(fromID[0]));
                    if (toID[0] == this.nextLetter(fromID[0])) 
                    { 
                        this.setEndOfTurn();
                        return true;
                    } else if (toID[0] == this.previousLetter(fromID[0])) {
                        this.setEndOfTurn();
                        return true;
                    }
                    console.log('It is not.');
                }
            }
        }

        /* Are we jumping a piece? */
        if (distance == 2) {
            intermediate = this.getIntermediateSquare(from, to);
            console.log('Intermediate:');
            console.log(intermediate);
            if (turn.piece.get('pieceType') == 'King') {
                console.log('King jumping');
                if (intermediate.get('occupiedBy') == 'red' && turn.piece.get('occupiedBy') == 'black') {
                    turn.moves.unshift(intermediate);
                    turn.removedPieces.push(intermediate);
                    turn.hasJumped = true;
                    this.setCurrentTurn(turn);
                    return true;
                } else if (intermediate.get('occupiedBy') == 'black' && turn.piece.get('occupiedBy') == 'red') {
                    turn.moves.unshift(intermediate);
                    turn.removedPieces.push(intermediate);
                    turn.hasJumped = true;
                    this.setCurrentTurn(turn);
                    return true;
                }
            } else if (turn.piece.get('occupiedBy') == 'red') {
                if (toID[1] < fromID[1]) {
                    console.log('Red jumping');
                    if (intermediate.get('occupiedBy') == 'black') {
                        turn.moves.unshift(intermediate);
                        turn.removedPieces.push(intermediate);
                        turn.hasJumped = true;
                        this.setCurrentTurn(turn);
                        return true;
                    }
                }
            } else {
                if (toID[1] > fromID[1]) {
                    console.log('Black jumping');
                    if (intermediate.get('occupiedBy') == 'red') {
                        turn.moves.unshift(intermediate);
                        turn.removedPieces.push(intermediate);
                        turn.hasJumped = true;
                        this.setCurrentTurn(turn);
                        return true;
                    }
                }
            }
        }


        return false;
    },
    nextLetter: function(letter, distance) {
        distance = distance || 1;
        /* We convert to a char code, then increment to get the next letter */
        var c = letter.charCodeAt(0);
        return String.fromCharCode(c + distance);
    },
    previousLetter: function(letter, distance) {
        distance = distance || 1;
        /* We convert to a char code, then decrement to get the previous letter */
        var c = letter.charCodeAt(0);
        return String.fromCharCode(c - distance);
    },
    setEndOfTurn: function() {
        var turn = this.getCurrentTurn();
        turn.endOfTurn = true;
        this.setCurrentTurn(turn);
    },
    decorateCurrentTurn: function() {
        var turn = this.getCurrentTurn();
        return this.decorateTurn(turn);
    },
    decoratePreviousTurn: function() {
        var turn = this.getPreviousTurn();
        return this.decorateTurn(turn);
    },
    decorateTurn: function(turn) {
        var i, from, to, fromID, toID, cls;
        /* First place our arrows */
        for (i = turn.moves.length - 1; i > 0; i--) {
            from = turn.moves[i];
            to = turn.moves[i - 1];
            fromID = from.get('squareID').split('');
            toID = to.get('squareID').split(''); // This makes the letter element 0, and the number element 1.
            if (fromID[1] < toID[1]) {
                cls = 'down';
            } else {
                cls = 'up';
            }
            if (fromID[0] < toID[0]) {
                cls += '_right';
            } else {
                cls += '_left';
            }
            from.set('decoration', cls);
        }

        for (i = 0; i < turn.removedPieces.length; i++) {
            cls = turn.removedPieces[i].get('decoration');
            cls += ' removed';
            turn.removedPieces[i].set('decoration', cls);
        }

        this.getBoard().refresh();
    },
    getIntermediateSquare: function(from, to) {
        var fromID, toID, intermediateID = [];
        fromID = from.get('squareID').split('');
        toID = to.get('squareID').split(''); // This makes the letter element 0, and the number element 1.
        if (fromID[1] < toID[1]) {
            intermediateID[1] = parseInt(fromID[1]) + 1;
        } else {
            intermediateID[1] = parseInt(fromID[1]) - 1;
        }
        if (toID[0] == this.nextLetter(fromID[0], 2)) {
            intermediateID[0] = this.nextLetter(fromID[0]);
        } else {
            intermediateID[0] = this.previousLetter(fromID[0]);
        }
        console.log(fromID, toID, intermediateID);
        return this.getBoard().getStore().getById(intermediateID.join(''));
    }
});
