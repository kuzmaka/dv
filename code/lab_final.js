import {W, H} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";
import {addLift, goto} from "./functions";

export default () => {

    let liftTilePos;

    const tiles = [
        [
            {
                name: 'lab1',
                floor: 8,
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    liftTilePos = tile.pos

                    // floor
                    add([
                        pos(x, y + H - 8),
                        area({
                            width: W,
                            height: 8
                        }),
                        solid()
                    ])

                    add([
                        pos(x + 200, y),
                        sprite('container'),
                        area(),
                        body()
                    ])
                }
            },
            // {
            //     name: 'lab-final',
            //     checkpoint: vec2(20, H-110),
            //     onAdded: (tile, i, j) => {
            //         const [x, y] = [tile.pos.x, tile.pos.y];
            //
            //         // left floor
            //         add([
            //             pos(x, y+H),
            //             origin("botright"),
            //             area({
            //                 width: W,
            //                 height: 8
            //             }),
            //             solid()
            //         ])
            //         // left darkness
            //         add([
            //             pos(x, y),
            //             origin('topright'),
            //             rect(W, H),
            //             color(BLACK),
            //             z(100)
            //         ])
            //         // door
            //         const door = add([
            //             pos(x, y),
            //             area({
            //                 width: 8,
            //                 height: H - 8
            //             }),
            //         ])
            //
            //         const cancel = door.onCollide('player', (p) => {
            //             goto('intro', {final: true, hasBlueKey: true})
            //             cancel()
            //         })
            //
            //         // right wall
            //         add([
            //             pos(x + W - 8, y),
            //             area({
            //                 width: 8,
            //                 height: H - 8
            //             }),
            //             solid()
            //         ])
            //     }
            // }
        ],
        [
            'lab1'
        ]
    ];
    addTiles(tiles, {
        floor: 8,
    })

    const player = addPlayer({
        x: 10,
        y: 94,
    })

    addLift(liftTilePos, player)

    setupCamera(player)
}
