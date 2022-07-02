import {W, H, gameState} from './init'
import {addPlayer, addTiles, addUI, setupCamera} from "./createLevel";
import {officeBossBehaviour, swing} from "./components";
import {addGasLattice, gasSystem, addObjects, addSuperFirePepper, addLift, addHeli} from "./functions";

export default () => {

    let liftTilePos;
    let lift;

    addUI()

    const tiles = [
        [
            {
                name: "office5-1",
                onAdded: (tile) => {
                    tile.play('light')
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // lift stuff
                    liftTilePos = tile.pos
                    // button
                    add([
                        pos(x + 75, y + 255),
                        origin('top'),
                        sprite('liftup'),
                    ])
                    const door = add([
                        pos(tile.pos.add(0, H-8)),
                        origin('botleft'),
                        area({
                            width: 8,
                            height: H-16
                        }),
                        solid()
                    ])
                    const fading = add([
                        pos(x, y),
                        origin("topright"),
                        rect(W, H),
                        color(BLACK),
                        opacity(0.7),
                        z(1000)
                    ])
                    const cnc = tile.onUpdate(() => {
                        if (gameState.hasBlueKey && player.pos.x < 100) {
                            door.solid = false
                            fading.opacity = 0
                        } else {
                            door.solid = true
                            fading.opacity = 0.7
                        }
                        if (player.pos.y < tile.pos.y && player.pos.x > 100) {
                            // roof - left wall
                            add([
                                pos(0, 0),
                                origin("botright"),
                                area({
                                    width: 10,
                                    height: H
                                }),
                                solid()
                            ])
                            fading.opacity = 0.7
                            lift.trigger('lift-go')
                            cnc()
                        }
                    })


                    //wall substitude
                    add([
                        pos(x - 5, 0),
                        area({
                            width: 5,
                            height: H
                        }),
                        'wall'
                    ])
                    //floor
                    add([
                        pos(x, y + 350),
                        area({
                            width: 1855,
                            height: 10
                        }),
                        solid(),
                        'wall'
                    ])
                    //boss trigger
                    add([
                        pos(x, y),
                        area({
                            width: 2*W,
                            height: H
                        }),
                        'bossTrigger'
                    ])

                }
            },
            {
                name: "office5-2",
                onAdded: (tile) => {
                    tile.play('light')
                }
            },
            {
                name: "office5-3",
                checkpoint: vec2(500, 200),
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    tile.play('light')
                }
            }
        ],
        [
            {
                name: "office4-1",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    table(vec2(x + 40, y + 291))
                    addSuperFirePepper(x + 65, y + 270)
                }
            },
            {
                name: "office4-2",
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    gasSystem([
                        [vec2(x - 2, y + 350), {scd: 0, cd: 6, atkTime: 3}],
                        [vec2(x + 29, y + 350), {scd: 0, cd: 6.2}],
                        [vec2(x + 60, y + 350), {scd: 0, cd: 5.9}],
                        [vec2(x + 91, y + 350), {scd: 0, cd: 5.5}],
                        [vec2(x + 122, y + 350), {scd: 0, cd: 5}],
                        [vec2(x + 153, y + 350), {scd: 2.7, cd: 5, atkTime: 5}],
                        [vec2(x + 184, y + 350), {scd: 2.4, cd: 2}],
                        [vec2(x + 215, y + 350), {scd: 2.1, cd: 2.3}],
                        [vec2(x + 246, y + 350), {scd: 1.8, cd: 2.6}],
                        [vec2(x + 277, y + 350), {scd: 1.5, cd: 5.8}],
                        [vec2(x + 308, y + 350), {scd: 1.2, cd: 5.6}],
                        [vec2(x + 339, y + 350), {scd: 0.9, cd: 5.4}],
                        [vec2(x + 370, y + 350), {scd: 0.6, cd: 5.2}],
                        [vec2(x + 401, y + 350), {scd: 0.3, cd: 5}],
                        [vec2(x + 432, y + 350), {scd: 5, atkTime: 10}]
                    ], 18)
                }
            },
            {
                name: "office4-3",
                checkpoint: vec2(100, 250),
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        sprite('arrow-5', {anim: 'idle'}),
                        pos(x, y)
                    ])
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
                checkpoint: vec2(0, 200),
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
                    add([
                        pos(x, y),
                        sprite('arrow-4', {anim: 'idle'})
                    ])
                    addGasLattice(vec2(x + 250, y + 350))
                    addGasLattice(vec2(x + 636, y + 150), {
                        rotate: true,
                        flip: true,
                        scd: 4
                    })
                    addGasLattice(vec2(x + 636, y + 20), {
                        rotate: true,
                        flip: true,
                        scd: 4.5
                    })
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
                checkpoint: vec2(400, 250),
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
                checkpoint: vec2(50, 250),
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
                    addTeleport(vec2(x + 579, y + 349), vec2(x + 460, y - H + 250))
                    add([
                        sprite('arrow-2', { anim: 'idle' }),
                        pos(x + 450, y + 120)
                    ])
                    addObjects(parkour[0], { pos: vec2(x, y) })
                }
            }
        ]
    ]

    // roof - floor
    const tilesCount = tiles[0].length;
    add([
        pos(0, 0),
        origin('botleft'),
        rect(W * tilesCount, 10),
        outline(),
        color(rgb(0x35, 0x2d, 0x48))
    ])
    // roof - right wall
    add([
        pos(W * tilesCount, 0),
        origin("botleft"),
        area({
            width: 10,
            height: H
        }),
        solid()
    ])

    const fm = [
        "   ",
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

    //black bg
    add([
        pos(-1000, 0),
        rect(1000, H * tiles.length),
        color('black')
    ])
    add([
        pos(W * tiles[0].length, 0),
        rect(1000, H * tiles.length),
        color('black')
    ])

    const player = addPlayer({
        x: 1300,
        y: 540
    })

    lift = addLift(liftTilePos, player, true, {})
    addHeli(liftTilePos.add(W, -3))

    setupCamera(player)
    camPos(vec2(camPos().x, H * 1.5))

    //background
    add([
        pos(0),
        sprite('sky-night', {anim: 'blink'}),
        z(-100),
        fixed()
    ])

    player.onCollide('bossTrigger', (tr) => {
        let b = add([
            pos(200, H - 132),
            origin('center'),
            sprite('office-boss', {flipX: true}),
            area({
                offset: vec2(-30, 67),
                width: 167,
                height: 113
            }),
            health(100),
            state('idle', ['idle', 'attack', 'throw', 'run', 'death']),
            officeBossBehaviour()
        ])
        //camerascale
        let c = add([
            pos(0, 0),
            area({
                width: 3 * W,
                height: H
            }),
            'camTrigger2'
        ])
        b.toDestroy.push(c)
        b.toDestroy.push(add([
            sprite('office-floor'),
            pos(3*W - 64, H - 10),
            area(),
            solid()
        ]))
        //boss trigger
        player.onRespawn.push(() => {
            b.destroy()
            b = add([
                pos(200, H - 132),
                origin('center'),
                sprite('office-boss', {flipX: true}),
                area({
                    offset: vec2(-30, 67),
                    width: 167,
                    height: 113
                }),
                health(10),
                state('idle', ['idle', 'attack', 'throw', 'run', 'death']),
                officeBossBehaviour()
            ])
        })
        destroy(tr)
    })


    const scaleTriggers = get('camTrigger')
    var black1
    var black2
    player.onUpdate(() => {
        let triggered = false
        let triggered2 = false
        scaleTriggers.forEach((trigger) => {
            if(player.isColliding(trigger)) triggered = true
        })
        const scaleTriggers2 = get('camTrigger2')[0]
        if(scaleTriggers2 !== undefined && player.isColliding(scaleTriggers2)) triggered2 = true
        if(triggered) camScale(camScale().lerp(vec2(0.5), dt()*3))
        else if(!triggered2) camScale(camScale().lerp(vec2(1), dt()*3))
        if(triggered2) {
            camScale(camScale().lerp(vec2(0.5), dt()*3))
            if(black1 === undefined) {
                black1 = add([
                    pos(0, H),
                    rect(3*W, H),
                    color('black'),
                    z(200)
                ])
            }
            if(black2 === undefined) {
                black2 = add([
                    pos(-W, -H),
                    rect(5*W, H),
                    color('black'),
                    z(200)
                ])
            }
        } else if(!triggered) {
            camScale(camScale().lerp(vec2(1), dt()*3))
            if(black1 !== undefined) {
                destroy(black1)
                black1 = undefined
            }
            if(black2 !== undefined) {
                destroy(black2)
                black2 = undefined
            }
        }
    })
}

function addTeleport(pos1, pos2) {
    add([
        sprite('teleport'),
        pos(pos1.clone()),
        area(),
        {
            load() {
                this.onCollide('player', (p) => {
                    p.pos = pos2.clone()
                })
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
        "     r                 ",
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
        "                   ",
        "              !===!",
        "     r             ",
        "  !======!         ",
        "                   ",
        "                   ",
        "           !=====b!",
        "       !==!        ",
        "                   ",
        "                   ",
    ],
]

