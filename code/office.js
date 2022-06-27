import {W, H} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [
            {
                name: 'office2-1'

            },
            {
                name: 'office2-2',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        pos(x + 200, y + 115),
                        area({
                            width: 300,
                            height: 240
                        }),
                        'camscale'
                    ])
                    addLevel(parkour[1], {
                        pos: vec2(x + 400, y),
                        width: 32,
                        height: 32,
                        "!": () => [
                            sprite('shelf-edge'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ],
                        "=": () => [
                            sprite('shelf-middle'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ],
                        "b": () => [
                            sprite('shelf-books'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ]
                    })
                }
            },
            {
                name: 'office2-3',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    let t = add([
                        sprite('teleport'),
                        pos(x + 576, y + 349),
                        area()
                    ])
                    t.onCollide('player', (p) => {
                        p.pos = vec2(x + 470, y + H + 250)
                        camPos(camPos().add(0, H))
                    })
                }
            }
        ],
        [
            {
                name: 'office1-1'
            },
            {
                name: 'office1-2'
            },
            {
                name: 'office1-3',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    let t = add([
                        sprite('teleport'),
                        pos(x + 579, y + 349),
                        area()
                    ])
                    t.onCollide('player', (p) => {
                        p.pos = vec2(x + 470, y - H + 250)
                        camPos(camPos().add(0, -H))
                    })
                    let l = add([
                        sprite('lattice'),
                        pos(x + 541, y + 350),
                        {
                            cooldown: 3
                        }
                    ])
                    l.onUpdate(() => {
                        if(l.cooldown > 0) l.cooldown -= dt()
                        else {
                            add([
                                sprite('gas'),
                                pos(l.pos.sub(0, 32)),
                                area(),
                                move(-90, 100),
                                lifespan(1, {fade: 0.5})
                            ])
                            l.cooldown = 3
                        }
                    })
                    addLevel(parkour[0], {
                        pos: vec2(x, y),
                        width: 32,
                        height: 32,
                        "!": () => [
                            sprite('shelf-edge'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ],
                        "=": () => [
                            sprite('shelf-middle'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ],
                        "b": () => [
                            sprite('shelf-books'),
                            area({
                                offset: vec2(0, 28),
                                height: 4
                            }),
                            solid()
                        ],
                        "r": () => [
                            sprite('office-rat'),
                            area({
                                width: 54,
                                height: 54,
                                offset: vec2(0, 20)
                            }),
                            body(),
                            solid(),
                            origin('center'),
                            'enemy'
                        ]
                    })
                    get('enemy').forEach((enemy) => {
                        enemy.play('run')
                    })
                }
            }
        ]
    ]
    addTiles(tiles, {
        floor: 10
    })

    const player = addPlayer({
        x: 1400,
        y: 540
    })

    setupCamera(player)
    camPos(vec2(camPos().x, H * 1.5))

    const scaleobj = get('camscale')[0]
    player.onUpdate(() => {
        if(player.isColliding(scaleobj)) {
            camScale(camScale().lerp(vec2(0.5), dt()*3))
        } else {
            camScale(camScale().lerp(vec2(1), dt()*3))
        }
    })
}

const parkour = [
    [
        "                    ",
        "                    ",
        "  r                 ",
        "!===!    !=b==!     ",
        "                    ",
        "                    ",
        "!===bb!====!        ",
        "                    ",
        "                    ",
        "                    ",
    ],
    [
        "                       ",
        "!=====================!",
        "                       ",
        "                       ",
        "!===!      !==b!b===!  ",
        "                       ",
        "    !bb=!              ",
        "                       ",
        " !=====!=====!         ",
    ]
]

