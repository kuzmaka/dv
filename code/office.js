import {W, H} from './init'
import {addObjects, addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [
            {
                name: "office4-1"
            },
            {
                name: "office4-2"
            },
            {
                name: "office4-3",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    //floor
                    add([
                        pos(x, y + 350),
                        area({
                            width: 240,
                            height: 10
                        }),
                        solid()
                    ])
                    add([
                        pos(x + 330, y + 350),
                        area({
                            width: 310,
                            height: 10
                        }),
                        solid()
                    ])
                    addObjects(parkour[4], {pos: vec2(x, y)})
                }
            }
        ],
        [
            {
                name: "office3-1",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    //floor
                    add([
                        pos(x + 100, y + 350),
                        area({
                            width: 540,
                            height: 10
                        }),
                        solid()
                    ])
                    table(vec2(x + 200, y + 291))
                    addGasLattice(vec2(x + 265, y + 350))
                    table(vec2(x + 300, y + 291))
                    addGasLattice(vec2(x + 365, y + 350))
                    table(vec2(x + 400, y + 291))
                    addGasLattice(vec2(x + 465, y + 350))
                    table(vec2(x + 500, y + 291))
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
                        'camTrigger'
                    ])
                    addObjects(parkour[3], {pos: vec2(x + 400, y)})
                }
            },
            {
                name: "office3-3",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addGasLattice()
                }
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
                    table(vec2(x + 290, y + 291))
                    table(vec2(x + 400, y + 291))
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
                        'camTrigger'
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
                checkpoint: vec2(100, 200),
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
        "__ ",
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
        x: 1000,
        y: 180
    })

    setupCamera(player)
    camPos(vec2(camPos().x, H * 1.5))

    const scaleTriggers = get('camTrigger')
    player.onUpdate(() => {
        let triggered = false
        scaleTriggers.forEach((trigger) => {
            if(player.isColliding(trigger)) triggered = true
        })
        if(triggered) camScale(camScale().lerp(vec2(0.5), dt()*3))
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

function addGasLattice(p, opt = {}) {
    add([
        sprite(opt.rotate ? 'lattice-y' : 'lattice-x', {flipY: !opt.flip, flipX: opt.flip}),
        pos(p),
        {
            cooldown: opt.scd !== undefined ? opt.scd : opt.cd !== undefined ? opt.cd : 3,
            attack: 0,
            microcd: 3,
            gasSpeed: 150,
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
                        pos(this.pos.sub(opt.rotate ? (opt.flip ? 32 : -4) : 0, opt.rotate ? 0 : opt.flip ? -4 : 32)),
                        area(),
                        move(-90 * (opt.flip ? -1 : 1) + 90 * (opt.rotate ? 1 : 0) + rand(-10, 10), this.gasSpeed),
                        lifespan(1, {fade: 0.5}),
                        {
                            load() {
                                this.onCollide('player', (p) => {
                                    p.die()
                                })
                            }
                        }
                    ])
                    this.microcd = 3
                }
            }
        }
    ])
}

function table(p) {
    add([
        sprite('table', {frame: randi(2)}),
        pos(p),
        area({
            height: 2,
            offset: vec2(0, 22)
        }),
        solid()
    ])
}

const parkour = [
    //1-3   [0]
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
    //2-3   [1]
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
    //2-1   [2]
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
    ],
    //3-3   [3]
    [
        "                           ",
        "!======!========!=======!  ",
        "                           ",
        "                           ",
        "                           ",
        "                 !=======b!",
        "                           ",
        "                           ",
        "     !=b==b==!             ",
        "                           ",
    ],
    //4-3   [4]
    [
        "              ==   ",
        "                   ",
        "  r                ",
        "!===!    !=b==!    ",
        "                   ",
        "                   ",
        "!===bb!====!=======",
        "                   ",
        "                   ",
        "              ==   ",
    ],
]

