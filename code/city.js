import {W, H, DEBUG_NO_SLEEP} from './init'
import {addPlayer, addTiles, addUI, setupCamera} from "./createLevel";
import {addContainer} from "./functions";
import {fade} from "./components";

export default () => {
    let playerStartPos;

    const hintQ = addUI()

    const tiles = [
        [
            {
                name: 'empty',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    playerStartPos = tile.pos.add(300, 150)

                    add([
                        pos(x, y),
                        sprite('ship-mid'),
                        z(100)
                    ])

                    // floor
                    add([
                        pos(x, y+H-140+40),
                        area({width: W, height: 50}),
                        solid()
                    ])

                    // container
                    addContainer(x - 10, y+133)
                    addContainer(x - 10, y+6)
                    addContainer(x - 10, y-121)
                }
            },
            {
                name: 'ship-mid-end-back',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    add([
                        pos(x, y),
                        sprite('ship-mid-end-front'),
                        z(100)
                    ])

                    // floor
                    add([
                        pos(x, y+H-140+40),
                        area({width: W, height: 50}),
                        solid()
                    ])
                }
            },
            {
                name: 'ship-end-back',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    add([
                        pos(x, y),
                        sprite('ship-end-front'),
                        z(100)
                    ])

                    // floor
                    add([
                        pos(x, y+H-140+40),
                        area({width: W, height: 50}),
                        solid()
                    ])
                }
            }
        ]
    ]

    addTiles(tiles, {
        floor: 8,
    })

    const player = addPlayer({
        x: playerStartPos.x,
        y: playerStartPos.y,
        sleeping: !DEBUG_NO_SLEEP
    })
    // fade in
    add([
        pos(player.pos.x-W, player.pos.y-H),
        rect(3*W, 3*H),
        fade(2, {from: 1, to: 0}),
        color(BLACK),
        z(1000)
    ])

    setupCamera(player)

    // sky
    add([
        pos(0),
        sprite('sky-night', {anim: 'blink'}),
        z(-100),
        fixed()
    ])

}