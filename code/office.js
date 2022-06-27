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
                    addTeleport(vec2(x + 576, y + 349), vec2(x + 470, y + H + 250))
                    addGasLattice(vec2(x + 360, y + 350))
                    addGasLattice(vec2(x + 250, y + 350))
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
                    addTeleport(vec2(x + 579, y + 349), vec2(x + 470, y - H + 250))
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
                            move(0, 150),
                            origin('center'),
                            {
                                load() {
                                    this.play('run')
                                }
                            },
                            'enemy'
                        ]
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

function addTeleport(pos1, pos2) {
    add([
        sprite('teleport'),
        pos(pos1),
        area(),
        {
            load() {
                this.onCollide('player', (p) => {
                    p.pos = pos2
                    camPos(camPos().add(0, (Math.floor(pos2.y/H) - Math.floor(pos1.y/H)) * H))
                })
            }
        }
    ])
}

function addGasLattice(_pos, opt) {
    add([
        sprite('lattice'),
        pos(_pos),
        {
            cooldown: 3,
            attack: 0,
            update() {
                if(this.attack > 0) this.attack -= dt()
                if(this.cooldown > 0) this.cooldown -= dt()
                else {
                    this.cooldown = 3
                    this.attack = 0.5
                }
                if(this.attack > 0) {
                    add([
                        sprite('gas'),
                        pos(this.pos.sub(0, 32)),
                        area(),
                        move(-90 + rand(-10, 10), 100),
                        lifespan(1, {fade: 0.5})
                    ])
                }
            }
        }
    ])
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

