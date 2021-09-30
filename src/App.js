import './App.css';
import React from 'react';

function Tile(props) {
    // return a square tile
    return (
        <div className="square" style={{backgroundColor: props.color}}>
            <span>{props.value === 0 ? "-" : props.value}</span>
        </div>
    )

}

class Board extends React.Component {
    // initialize tiles array within state
    constructor(props) {
        super(props);
        // set color map for tiles
        this.colorMap = new Map([[0, "#595959"], [2, "#DCDCDC"], [4, "#FAFAD2"], [8, "#FFD700"],
            [16, "#FFA500"], [32, "#FF6347"]])
        this.state = {
            // keep track of tile values in each location
            tiles: Array(16).fill(0),

        }
    }

    componentDidMount() {
        // set key listener for arrow keys
        document.addEventListener('keyup', e => this.onKeyPress(e), true);

        // fill two starter tiles
        const newTiles = this.state.tiles.slice();
        this.fillNewTile(newTiles);
        this.fillNewTile(newTiles);
        this.setState({tiles: newTiles});


    }

    // spawn a new tile on an empty space in the given tile array
    fillNewTile(tiles_array) {
        // TODO: Could trigger game loss if length of open is zero, meaning all spaces are currently filled, probably not since fillNewTile won't be called in current state
        let open = []; // track all open slots, one will be filled with a new tile
        for (let i = 0; i < tiles_array.length; i++) {
            if (tiles_array[i] === 0) {
                open.push(i);
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
        let currentVal = this.state.tiles[i];
        return (
            // send value and color, support default color of black for unmapped values
            <Tile
                value={currentVal}
                color={this.colorMap.has(currentVal) ? this.colorMap.get(currentVal) : "#000000"}
            />
        )
    }

    // execute shift, loop from start to end, inclusive, ang give increment direction
    shiftManager(shiftType) {
        console.count("In shift manager")
        // a list of indexes that have already merged this cycle so that double merges don't occur
        let movementOccurred = false;
        let newTiles = this.state.tiles.slice();
        let merged = new Set();
        // execute the given shift type, check if movement occurred
        movementOccurred = shiftType(newTiles, merged); // TODO: tiles need to be shifted in the opposite direction, so that all stacked tiles
        // TODO: Could basically loop through in the same order as now, but see if there is a tile to be "pulled in" to the current space rather
        // Than trying to merge into the current space

        // Add new til and update state if shift occurs
        if (movementOccurred) {
            this.fillNewTile(newTiles)
            // spawn a new tile now that the shift is done
            this.setState({tiles: newTiles});
        }
    }

    // move a tile from the idx to the shiftIdx if valid shift is possible
    executeShift(tiles_list, merged, idx, shiftIdx) {
        // if there is a tile at the index to move, and the shift index is valid that could move here that could move here
        if (tiles_list[idx] && shiftIdx >= 0 && shiftIdx <= 15) {
            // if moving to an empty tile
            if (tiles_list[shiftIdx] === 0) {
                // move tile
                tiles_list[shiftIdx] = tiles_list[idx];
                tiles_list[idx] = 0;
                // if this tile has been merged previously, make sure to keep track at the new index
                if (merged.has(idx)) {
                    merged.delete(idx);
                    merged.add(shiftIdx);
                }
                return true;
            }
            // otherwise, if the value of the tiles is equal, make sure they haven't been merged during this shift
            else if (tiles_list[idx] === tiles_list[shiftIdx] && !merged.has(idx) && !merged.has(shiftIdx)) {
                // merge tile values
                tiles_list[shiftIdx] += tiles_list[idx]
                tiles_list[idx] = 0; // old location set to zero
                // track that the tile has been merged during this shift
                merged.add(shiftIdx);
                return true;
            }
            // if there is a tile above and it is not able to merge, we need to see if it can move so that this tile
            // doesn't get blocked
            else {
                // calculate the shift interval
                let shift_interval = shiftIdx - idx;
                let block_moved = this.executeShift(tiles_list, merged, shiftIdx, shiftIdx + shift_interval);
                // if the above block was able to move, then we can execute this move
                if (block_moved) {
                    // move tile
                    tiles_list[shiftIdx] = tiles_list[idx];
                    tiles_list[idx] = 0;
                    // if this tile has been merged previously, make sure to keep track at the new index
                    if (merged.has(idx)) {
                        merged.delete(idx);
                        merged.add(shiftIdx);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    /*
    Methods for managing directional shift
     */
    upShift = (newTiles, merged) => {
        let movementOccurred = false;
        // loop up until the last row since nothing can be pulled up into the last row
        for (let i = 15; i >= 0; i--) {
            movementOccurred = this.executeShift(newTiles, merged, i, i - 4) || movementOccurred;
        }
        return movementOccurred;
    }

    downShift = (newTiles, merged) => {
        let movementOccurred = false;
        // loop up until the first row, nothing will be pulled from above the first row
        for (let i = 0; i <= 15; i++) {
            movementOccurred = this.executeShift(newTiles, merged, i, i + 4) || movementOccurred;
        }
        return movementOccurred;
    }

    leftShift = (newTiles, merged) => {
        let transformTiles = [];
        let movementOccurred = false;
        // loop up until the first row, nothing will be pulled from above the first row
        for (let j = 0; j < 4; j++) {
            for (let i = 15; i >= 4; i--) {
                movementOccurred = this.executeShift(newTiles, merged, i, i - 4) || movementOccurred;
            }
        }
        return movementOccurred;
    }


    // listen for arrow keys
    onKeyPress(e) {
        console.count("In keyPress function")
        // left arrow
        if (e.code === "ArrowLeft") {

        }
        // up arrow
        else if (e.code === "ArrowUp") {
            // move tiles up starting at the bottom of the board
            this.shiftManager(this.upShift);
        }
        // right arrow
        else if (e.code === "ArrowRight") {

        }
        // down arrow
        else if (e.code === "ArrowDown") {
            // move tiles down starting from the top of the board
            this.shiftManager(this.downShift);

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
