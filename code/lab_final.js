import {W, H} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";
import {goto} from "./functions";

export default () => {

    const tiles = [
        [
            {
                name: 'empty',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    const lift = add([
                        pos(x+W, y+H),
                        origin('botright'),
                        sprite('lift'),
                        area({
                            offset: vec2(-50, 0),
                            width: 150
                        }),
                    ])
                    const wall = add([
                        pos(lift.pos.x-lift.width, lift.pos.y-8),
                        origin('botleft'),
                        area({
                            width: 8,
                            height: lift.height-8
                        }),
                        solid()
                    ])
                    const floor = add([
                        pos(x+W, y + H),
                        origin('botright'),
                        area({
                            width: 199,
                            height: 8
                        }),
                        solid()
                    ])
                    wall.pos = vec2(lift.pos.x-lift.width, lift.pos.y-8)
                    floor.pos = lift.pos.clone()
                    let state = 'top';
                    let fromY;
                    const cnc = lift.onCollide('player', () => {
                        if (state === 'top') {
                            state = 'down';
                            fromY = lift.pos.y;
                        }
                        if (state === 'bottom') {
                            state = 'up'
                            fromY = lift.pos.y;
                        }
                    })
                    lift.onUpdate(() => {
                        if (state === 'down' || state === 'up') {
                            const inLift = player.curPlatform() === floor;
                            lift.moveTo(x+W, y+H + (state === 'down' ? H : 0), 100)
                            floor.pos = lift.pos.clone()
                            wall.pos = vec2(lift.pos.x-lift.width, lift.pos.y-8)
                            if (lift.pos.y === y + H + (state === 'down' ? H : 0)) {
                                state = state === 'down' ? 'bottom' : 'top';
                            }
                            if (inLift) {
                                player.moveTo(player.pos.x, lift.pos.y - 8 - player.area.offset.y - player.area.height)
                            }
                        }
                    })
                }
            },
            {
                name: 'lab1',
                floor: 8,
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

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
            'empty',
            {
                name:'lab1',
                floor: 8
            }
        ]
    ];
    addTiles(tiles, {
        // floor: 8,
    })

    const player = addPlayer({
        x: W + 10,
        y: H - 94,
    })

    setupCamera(player)
}
