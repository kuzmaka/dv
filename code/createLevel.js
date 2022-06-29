import {H, SHOW_TILE_INDEX, W} from "./init";
import {checkpoint, fade} from "./components";

const PLAYER_SPEED = 400;

export function addTiles(tiles, opt = {}) {

    tiles.forEach((Tiles, i) => {
        Tiles.forEach((tile, j) => {
            const name = typeof tile === 'string' ? tile : tile.name;
            const t = add([
                pos(j * W, i * H),
                sprite(name),
                z(-10)
            ])

            if (typeof tile.checkpoint !== 'undefined') {
                add([
                    pos(j * W, i * H),
                    area({
                        width: W,
                        height: H
                    }),
                    checkpoint(tile.checkpoint.add(j * W, i * H))
                ])
            }

            // floor
            if((typeof opt.floorMap === 'undefined' || opt.floorMap[i][j] === '_') && typeof opt.floor !== 'undefined')
                add([
                    pos(t.pos.x, t.pos.y + H - opt.floor),
                    area({
                        width: W,
                        height: opt.floor
                    }),
                    solid()
                ])

            if (SHOW_TILE_INDEX) {
                add([
                    pos(j * W, i * H),
                    text(i + '-' + j, {size: 24})
                ])
            }

            if (typeof tile === 'object' && tile.onAdded) {
                tile.onAdded(t, i, j)
            }
        })
    })

    if(opt.lwall !== undefined) {
        add([
            pos(0, 0),
            area({
                width: opt.lwall,
                height: tiles.length * H
            }),
            solid()
        ])
    }
    if(opt.rwall !== undefined) {
        add([
            pos(tiles[0].length * W - opt.rwall, 0),
            area({
                width: opt.rwall,
                height: tiles.length * H
            }),
            solid()
        ])
    }
    if(opt.ceil === true) {
        add([
            pos(0, -5),
            area({
                width: tiles[0].length * W,
                height: 5
            }),
            solid()
        ])
    }
}

export function setupCamera(player) {
    camPos(vec2(Math.max(player.pos.x + player.width/2 + (player.flip ? -80 : 80)), camPos().y))
    // let scale = 1000
    player.camSetup = player.onUpdate(() => {
        // if (player.dead) {
        //     camPos(vec2(player.pos.x + 78, player.pos.y + 80))
        //     if (scale > 1) {
        //         scale -= scale * dt()
        //     } else {
        //         scale = 1
        //     }
        //     camScale(scale)
        //     return
        // }
        const playerFloor = Math.floor((player.pos.y + player.area.offset.y)/H)
        const from = camPos().x
        const to = Math.max(player.pos.x + player.width/2 + (player.flip ? -80 : 80))
        camPos(vec2(from + Math.sign(to-from)*Math.min(Math.abs(to - from), 1.5*PLAYER_SPEED*dt()), (playerFloor + 0.5) * H))
    })
}

export function addPlayer(opt) {
    const player = add([
        pos(opt.x, opt.y),
        sprite("dog", {
            anim: 'dead',
            flipX: false
        }),
        area({
            offset: vec2(22, 40),
            width: 47,
            height: 34
        }),
        body(),
        {
            speed: 0,
            flip: false,
            dead: false,
            sleeping: opt.sleeping ? opt.sleeping : false,
            firstMoved: false,
            isDown: true,
            lastCheckpoint: null,
            camSetup: () => {},
            resetArea() {
                if (player.flip) {
                    player.area.offset.x = 40
                    player.area.offset.y = 40
                    player.area.width = 47
                    player.area.height = 46
                } else {
                    player.area.offset.x = 22
                    player.area.offset.y = 40
                    player.area.width = 47
                    player.area.height = 46
                }
            },
            layArea() {
                player.area.offset.x = 20
                player.area.offset.y = 67
                player.area.width = 69
                player.area.height = 20
            },
            die() {
                if (player.dead) return;
                player.dead = true
                player.speed = 0
                player.play('dead')
                shake()
                const shade = add([
                    pos(toWorld(vec2(0, 0).sub(100, 100))),
                    rect(W + 200, H + 200),
                    fade(1, {from: 0, to: 0.5}),
                    color(BLACK),
                    z(1000)
                ])
                const hint = add([
                    pos(toWorld(center())),
                    origin('center'),
                    text('Press R to restart', {size: 24}),
                    z(10000)
                ])
                const cnc = onKeyPress('r', () => {
                    // respawn
                    player.dead = false
                    player.firstMoved = false
                    player.speed = 0
                    player.play('idle')
                    shade.destroy()
                    hint.destroy()
                    player.moveTo(player.lastCheckpoint.playerPos)
                    this.camSetup()
                    setupCamera(player)
                    cnc()
                })
            },
            handleFirstMoved() {
                if (!player.firstMoved) {
                    player.firstMoved = true;
                    this.trigger('firstMoved')
                }
            }
        },
        z(50),
        'player'
    ]);
    player.onUpdate(() => {
        if (player.speed) {
            player.move(player.speed, 0)
        }
        if (player.curAnim() !== 'fall' && !player.curPlatform() && player.isFalling()) {
            player.play('fall')
        }
    })

    const SPEED = PLAYER_SPEED;
    const CRAWL_SPEED = PLAYER_SPEED/4;
    onKeyPress(['a', 'left'], () => {
        if (player.dead || player.sleeping) return;
        player.handleFirstMoved()
        player.speed = player.isDown ? -CRAWL_SPEED : -SPEED;
        player.flipX(player.flip = true)
        if (player.curPlatform()) {
            player.play(player.isDown ? 'crawl' : 'run')
            player.isDown ? player.layArea() : player.resetArea()
        }
    })
    onKeyRelease(['a', 'left'], () => {
        if (player.dead || player.sleeping) return;
        if (player.speed < 0) {
            player.speed = 0
            if (player.curPlatform()) {
                player.play(player.isDown ? 'lay' : 'idle')
                player.isDown ? player.layArea() : player.resetArea()
            }
        }
    })
    onKeyPress(['d', 'right'], () => {
        if (player.dead || player.sleeping) return;
        player.handleFirstMoved()
        player.speed = player.isDown ? CRAWL_SPEED : SPEED;
        player.flipX(player.flip = false)
        if (player.curPlatform()) {
            player.play(player.isDown ? 'crawl' : 'run')
            player.isDown ? player.layArea() : player.resetArea()
        }
    })
    onKeyRelease(['d', 'right'], () => {
        if (player.dead || player.sleeping) return;
        if (player.speed > 0) {
            player.speed = 0
            if (player.curPlatform()) {
                player.play(player.isDown ? 'lay' : 'idle')
                player.isDown ? player.layArea() : player.resetArea()
            }
        }
    })
    onKeyPress(['w', 'up', 'space'], () => {
        if (player.dead) return;
        if (player.curPlatform()) {
            player.sleeping = false
            player.handleFirstMoved()
            player.jump()
            player.play('jump')
            player.resetArea()
            player.isDown = false
        }
    })
    onKeyPress(['s', 'down'], () => {
        player.isDown = true
        if (player.dead || player.sleeping) return;
        if (player.curPlatform()) {
            if (player.speed) {
                player.speed = player.flip ? -CRAWL_SPEED : CRAWL_SPEED
                player.play('crawl')
            } else {
                player.play('lay')
            }
            player.layArea()
        }
    })
    onKeyRelease(['s', 'down'], () => {
        player.isDown = false
        if (player.dead || player.sleeping) return;
        if (player.curPlatform()) {
            if (player.speed) {
                player.speed = player.flip ? -SPEED : SPEED
                player.play(player.isDown ? 'crawl' : 'run')
            } else {
                player.play(player.isDown ? 'lay' : 'idle')
            }
            player.isDown ? player.layArea() : player.resetArea()
        }
    })
    player.onGround(() => {
        if (player.speed) {
            player.play(player.isDown ? 'crawl' : 'run')
            player.isDown ? player.layArea() : player.resetArea()
        } else {
            if (player.dead || player.sleeping) {
                player.play('dead')
                player.layArea()
            } else {
                player.play(player.isDown ? 'lay' : 'idle')
                player.isDown ? player.layArea() : player.resetArea()
            }
        }
    })

    player.onCollide('checkpoint', (checkpoint) => {
        player.lastCheckpoint = checkpoint
    })

    return player
}

//check if player can stand
function checkStanding(player) {
    let tmp = add([
        pos(player.pos),
        area({
            offset: vec2(21, 40),
            width: 60,
            height: 46
        }),
        solid()
    ])
    player.solid = false
    tmp.pushOutAll()
    player.solid = true
    let res = (tmp.pos.y - player.pos.y) <= 1
    destroy(tmp)
    return res
}

export function addObjects(map, opt) {
    addLevel(map, {
        pos: opt.pos,
        width: opt.width ? opt.width : 32,
        height: opt.height ? opt.height : 32,
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
            sprite('office-rat', {anim: 'run'}),
            area({
                width: 54,
                height: 54,
                offset: vec2(0, 20)
            }),
            body(),
            solid(),
            move(0, 150),
            origin('center'),
            'enemy'
        ],
        "t": () => [
            sprite('table', {frame: randi(2)}),
            area({
                height: 2,
                offset: vec2(0, 22)
            }),
            solid()
        ]
    })
}