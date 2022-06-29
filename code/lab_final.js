import {W, H} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";
import {goto} from "./functions";

export default () => {

    const tiles = [
        [
            {
                name: 'lab-final',
                checkpoint: vec2(20, H-110),
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // left floor
                    add([
                        pos(x, y+H),
                        origin("botright"),
                        area({
                            width: W,
                            height: 8
                        }),
                        solid()
                    ])
                    // left darkness
                    add([
                        pos(x, y),
                        origin('topright'),
                        rect(W, H),
                        color(BLACK),
                        z(100)
                    ])
                    // door
                    const door = add([
                        pos(x, y),
                        area({
                            width: 8,
                            height: H - 8
                        }),
                    ])

                    const cancel = door.onCollide('player', (p) => {
                        goto('intro', {final: true, hasBlueKey: true})
                        cancel()
                    })

                    // right wall
                    add([
                        pos(x + W - 8, y),
                        area({
                            width: 8,
                            height: H - 8
                        }),
                        solid()
                    ])
                }
            }
        ]
    ];
    addTiles(tiles, {
        floor: 8,
    })

    const player = addPlayer({
        x: 10,
        y: H - 94,
    })

    setupCamera(player)
}
