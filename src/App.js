import './App.css';
import React from 'react';
import update from 'react-addons-update';

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

    constructor(props) {
        super(props);
        this.state = {
            // keep track of tile values in each location
            tiles: Array(16).fill(0)
        }

        // fill two starter tiles
        this.fillNewTile();
        this.fillNewTile();
    }

    // spawn a new tile on an empty space in the board
    fillNewTile() {
        let open = []; // track all open slots, one will be filled with a new tile
        for (let i = 0; i < this.state.tiles.length; i++) {
            if (this.state.tiles[i] === 0) {
                open.push(i)
            }
        }
        // choose open index to make new tile in
        let openIndex = Math.floor(Math.random() * open.length);
        // get the corresponding index on the full board
        let boardIndex = open[openIndex];

        let value;
        // decide whether the index is a 4 (1/10 chance)
        let chance = Math.floor(Math.random() * 9)

        chance === 0 ? value = 4 : value = 2;

        // now set the new tile on the board TODO: should be moved away from direct assignment using setState
        this.state.tiles[boardIndex] = value;
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

    /*
    // listen for arrow keys
    onKeyPress(key) {
        // left arrow
        if (e.keyCode() === 37) {

        }
        // up arrow
        else if (e.keyCode() === 38) {

        }
        // right arrow
        else if (e.keyCode() === 39) {

        }
        // down arrow
        else if (e.keyCode() === 40) {

      }*/
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
