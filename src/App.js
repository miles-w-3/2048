import './App.css';
import React from 'react';

// TODO: Add event listener for arrow keys
class Tile extends React.Component {
    render() {
        // return a square tile
        return (
            // TODO: Eventually the buttons will instead be rounded squares with different colors, could potentially use a div style
            <button>
                {this.props.value}
            </button>
        )
    }
}

class Board extends React.Component {
    // initialize tiles array within state
    constructor(props) {
        super(props);
        this.state = {
            // keep track of tile values in each location
            tiles: Array(16).fill(0)
        }
    }

    componentDidMount() {
        // set key listener for arrowkeys
        document.addEventListener('keyup', e => this.onKeyPress(e), true);

        // fill two starter tiles
        const newTiles = this.state.tiles.slice();
        this.fillNewTile(newTiles);
        this.fillNewTile(newTiles);
        console.count("New tiles array is " + newTiles)
        this.setState({tiles: newTiles});
    }

    // spawn a new tile on an empty space in the given tile array
    fillNewTile(tiles_array) {
        // TODO: Could trigger game loss if length of open is zero, meaning all spaces are currently filled
        let open = []; // track all open slots, one will be filled with a new tile
        for (let i = 0; i < tiles_array.length; i++) {
            if (tiles_array[i] === 0) {
                open.push(i);
            }
        }
        console.count("Open array is " + open)
        // choose open index to make new tile in
        let openIndex = Math.floor(Math.random() * open.length);
        // get the corresponding index on the full board
        let boardIndex = open[openIndex];

        let value;
        // decide whether the index is a 4 (1/10 chance)
        let chance = Math.floor(Math.random() * 9)

        chance === 0 ? value = 4 : value = 2;
        tiles_array[boardIndex] = value;
    }


    // render the board on screen
    render() {
        return (
            // draw row by row, allowing 1d array
            <div>
                <div className="board-row">
                    {this.renderTile(0)}{this.renderTile(1)}{this.renderTile(2)}{this.renderTile(3)}
                </div>
                <div className="board-row">
                    {this.renderTile(4)}{this.renderTile(5)}{this.renderTile(6)}{this.renderTile(7)}
                </div>
                <div className="board-row">
                    {this.renderTile(8)}{this.renderTile(9)}{this.renderTile(10)}{this.renderTile(11)}
                </div>
                <div className="board-row">
                    {this.renderTile(12)}{this.renderTile(13)}{this.renderTile(14)}{this.renderTile(15)}
                </div>
            </div>
        );
    }

    // render the tile with value from the given location
    renderTile(i) {
        // TODO: create a dict of values to colors, pass in color as well
        return (
            <Tile
                value={this.state.tiles[i]}
            />
        )
    }

    shiftUp() {
        // TODO: need a list of indexes that have already merged this cycle so that double merges don't happen as you go up
        let tiles_new = this.state.tiles.slice();
        //let merged = Set()
        // continually shift tiles up to the top if there is an empty space within the board
        for (let i = 15; i >= 0; i--) {
            // if there is a tile at the current place and there is a valid space above
            if (tiles_new[i] && i - 4 >= 0) {
                // move into empty space
                if (tiles_new[i - 4] === 0) {
                    // swap tile locations
                    tiles_new[i - 4] = tiles_new[i]
                    tiles_new[i] = 0;
                }
                // otherwise, if the value of the tiles is equal, merge them TODO: Only merge if they have not been merged this time
                else if (tiles_new[i] === tiles_new[i - 4]) {
                    // merge tile values 
                    tiles_new[i - 4] += tiles_new[i]
                    tiles_new[i] = 0; // old location set to zero
                }
                // TODO: Experimental: updating state after each move to see if it animates (prolly wont)
                console.count("tiles is now: " + tiles_new)
                //this.setState({tiles: tiles_new});
            }
        }
        // TODO: Only spawn a new tile if any movement occurred. This function could return a true if any tiles moved, and then the main caller, maybe the keyListener, would call this if anything moved
        // spawn a new tile now that the shift is done
        this.fillNewTile(tiles_new); // TODO: does this get moved into the event listener?
        this.setState({tiles: tiles_new});
        console.log()
    }

    // listen for arrow keys
    onKeyPress(e) {
        console.count("In keyPress function")
        // left arrow
        if (e.code === "ArrowLeft") {

        }
        // up arrow
        else if (e.code === "ArrowUp") {
            console.count("In ArrowUp")
            this.shiftUp();
        }
        // right arrow
        else if (e.code === 39) {

        }
        // down arrow
        else if (e.code === 40) {

        }
    }
}


function Game() {

    return (
        <div className="game">
            <div className="game-board">
                <Board/>
            </div>
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
        </div>
    );
}

export default Game;
