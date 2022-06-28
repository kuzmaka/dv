import {W, H} from './init'
import {addObjects, addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [
            {
                name: "office3-1",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        pos(x + 100, y + 350),
                        area({
                            width: 540,
                            height: 10
                        }),
                        solid()
                    ])
                }
            },
            {
                name: "office3-2",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        pos(x + 120, y + 115),
                        area({
                            width: 300,
                            height: 240
                        }),
                        'camscale'
                    ])
                }
            },
            {
                name: "office3-3"
            }
        ],
        [
            {
                name: 'office2-1',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addObjects(parkour[2], {pos: vec2(x + 4, y)})
                    addGasLattice(vec2(x + 300, y), {flip: true})
                    addGasLattice(vec2(x + 260, y), {flip: true})
                    addGasLattice(vec2(x + 480, y), {flip: true})
                    add([
                        sprite('table', {frame: randi(2)}),
                        pos(x + 290, y + 291),
                        area({
                            // width: this.width,
                            height: 2,
                            offset: vec2(0, 22)
                        }),
                        solid()
                    ])
                    add([
                        sprite('table', {frame: randi(2)}),
                        pos(x + 400, y + 291),
                        area({
                            // width: this.width,
                            height: 2,
                            offset: vec2(0, 22)
                        }),
                        solid()
                    ])
                    add([
                        sprite('arrow-3', {anim: 'idle'}),
                        pos(x, y)
                    ])
                }
            },
            {
                name: 'office2-2',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        pos(x + 200, y + 115),
                        area({
                            width: 300,
                            height: 240
                        }),
                        'camscale'
                    ])
                    addObjects(parkour[1], {pos: vec2(x + 400, y)})
                }
            },
            {
                name: 'office2-3',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addTeleport(vec2(x + 576, y + 349), vec2(x + 470, y + H + 250))
                    addGasLattice(vec2(x + 360, y + 350))
                    addGasLattice(vec2(x + 250, y + 350))
                    add([
                        sprite('arrow-1', { anim: 'idle' }),
                        pos(x + 450, y + 120)
                    ])
                }
            }
        ],
        [
            {
                name: 'office1-1',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                }
            },
            {
                name: 'office1-2'
            },
            {
                name: 'office2-3',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addTeleport(vec2(x + 579, y + 349), vec2(x + 470, y - H + 250))
                    add([
                        sprite('arrow-2', { anim: 'idle' }),
                        pos(x + 450, y + 120)
                    ])
                    addObjects(parkour[0], { pos: vec2(x, y) })
                }
            }
        ]
    ]

    const fm = [
        " __",
        "___",
        "___"
    ]

    addTiles(tiles, {
        floor: 10,
        floorMap: fm,
        lwall: 4,
        rwall: 4,
        ceil: true
    })

    const player = addPlayer({
        x: 500,
        y: 180
    })

    setupCamera(player)
    camPos(vec2(camPos().x, H * 1.5))

    const scaleobjs = get('camscale')
    player.onUpdate(() => {
        let collides = false
        scaleobjs.forEach((scaleobj) => {
            if(player.isColliding(scaleobj)) collides = true
        })
        if(collides) camScale(camScale().lerp(vec2(0.5), dt()*3))
        else camScale(camScale().lerp(vec2(1), dt()*3))
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
                })
            }
        }
    ])
}

function addGasLattice(_pos, opt = {}) {
    add([
        sprite('lattice'),
        pos(_pos),
        {
            cooldown: 3,
            attack: 0,
            microcd: 3,
            gasSpeed: 150 * (opt.flip ? -1 : 1),
            update() {
                if(this.attack > 0) this.attack -= dt()
                if(this.microcd > 0) this.microcd -= 1
                if(this.cooldown > 0) this.cooldown -= dt()
                else {
                    this.cooldown = 3
                    this.attack = 1.5
                }
                if(this.attack > 0 && this.microcd <= 0) {
                    add([
                        sprite('gas'),
                        pos(this.pos.sub(0, opt.flip ? -4 : 32)),
                        area(),
                        move(-90 + rand(-10, 10), this.gasSpeed),
                        lifespan(1, {fade: 0.5})
                    ])
                    this.microcd = 3
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
    ],
    [
        "                       ",
        "!====!=====!====!      ",
        "                       ",
        "                       ",
        "           !==b!b==!   ",
        "                       ",
        "!===!                  ",
        "                       ",
        "                       ",
    ]
]

