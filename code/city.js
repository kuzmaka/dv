import {W, H} from './init'
import {addPlayer, addTiles, addUI, setupCamera} from "./createLevel";
import {addContainer, goto} from "./functions";
import {fade} from "./components";

export default () => {
    let playerStartPos;

    addUI()

    var music = play('wave', {
        loop: true
    })


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
                    addContainer(x - 10, y+133, true)
                    addContainer(x - 10, y+6, true)
                    addContainer(x - 10, y-121, true)
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

                    // right wall
                    add([
                        pos(x+W, y+H-140+40),
                        origin('botright'),
                        area({
                            width: 20,
                            height: 40
                        }),
                        solid()
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
                name: 'street0',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    // floor
                    add([
                        pos(x, y+H-63),
                        area({width: W - 100, height: 50}), // leaned floor in next tile requires some space
                        solid()
                    ])
                }
            },
            {
                name: 'street-office',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // leaned floor
                    const floor = add([
                        pos(x, y+H-63),
                        area({width: 110, height: 10}),
                        solid()
                    ])
                    tile.onUpdate(() => {
                        if (player.pos.x >= x - 200 && player.pos.x <= x+300) {
                            const fromX = floor.pos.x;
                            floor.moveTo(Math.min(Math.max(player.pos.x, x-100), x+200), mapc(player.pos.x, x-100, x+200,y+H-63, y+H-9))
                            if (player.curPlatform() === floor) {
                                // compensate floor movement and put player on ground
                                player.moveTo(player.pos.x - (floor.pos.x - fromX), floor.pos.y - player.area.offset.y - player.area.height)
                            }
                        }
                    })
                }
            },
            {
                name: 'office1-1',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // collision box
                    const coll = add([
                        pos(x, y),
                        area({
                            width: W,
                            height: H
                        })
                    ])

                    coll.onCollide('player', () => {
                        goto('office', 1)
                        music.stop()
                    })
                }
            },
            {
                name: 'office1-2',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                }
            }
        ]
    ]

    addTiles(tiles, {
        floor: 10,
    })

    const player = addPlayer({
        x: playerStartPos.x,
        y: playerStartPos.y,
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