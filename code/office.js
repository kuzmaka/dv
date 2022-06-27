import {addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [{name: 'office2-1'}, {name: 'office2-2'}, {name: 'office2-3'}],
        [{name: 'office1-1'}, {name: 'office1-2'}, {name: 'office1-3'}]
    ]
    addTiles(tiles, {
        floor: 10
    })

    const player = addPlayer(100, 180)

    setupCamera(player)
}
