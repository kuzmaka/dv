import {H, DEBUG_SHOW_TILE_INDEX, W, DEBUG_SUPER_WOOF, DEBUG_CAN_FIRE} from "./init";
import {checkpoint, fade} from "./components";
import {shakeObj} from "./functions";

const PLAYER_SPEED = 400;

export function addUI() {
    layers([
        'game',
        'ui',
    ], 'game')
    const hintQ = add([
        layer('ui'),
        pos(camPos().sub(width()/2-21, height()/2-15)),
        origin('center'),
        sprite('hint-q'),
        fixed(),
        opacity(DEBUG_SUPER_WOOF ? 1 : 0.3),
        scale()
    ])
    let timer = 0;
    const cnc = hintQ.onUpdate(() => {
        if (hintQ.opacity === 1) {
            timer += dt()
            if (timer < 1) {
                hintQ.scaleTo(1.3)
                hintQ.angle = 10*Math.sin(time()*40)
            } else {
                hintQ.scaleTo(1)
                hintQ.angle = 0;
                cnc()
            }
        }
    })
    return hintQ
}

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
            if((typeof opt.floorMap === 'undefined' || opt.floorMap[i][j] === '_') && (typeof opt.floor !== 'undefined' || typeof tile.floor !== 'undefined')) {
                const flr = typeof opt.floor !== 'undefined' ? opt.floor : tile.floor;
                add([
                    pos(t.pos.x, t.pos.y + H - flr),
                    area({
                        width: W,
                        height: flr
                    }),
                    solid()
                ])
            }

            if (DEBUG_SHOW_TILE_INDEX) {
                add([
                    pos(j * W, i * H),
                    text(i + '-' + j, {size: 24})
                ])
            }

            if (typeof tile === 'object' && tile.onAdded) {
                tile.onAdded(t, i, j)
            }
        })

        // dark tiles to the left and to the right to hide background
        add([
            pos(0, i * H),
            origin('topright'),
            rect(W, H),
            color(BLACK),
        ])
        add([
            pos(Tiles.length * W, i * H),
            origin('topleft'),
            rect(W, H),
            color(BLACK),
        ])
    })

    if(opt.lwall !== undefined) {
        add([
            pos(0, 0),
            area({
                width: opt.lwall,
                height: tiles.length * H
            }),
            solid(),
            'wall'
        ])
    }
    if(opt.rwall !== undefined) {
        add([
            pos(tiles[0].length * W - opt.rwall, 0),
            area({
                width: opt.rwall,
                height: tiles.length * H
            }),
            solid(),
            'wall'
        ])
    }
    if(opt.ceil === true) {
        add([
            pos(0, -5),
            area({
                width: tiles[0].length * W,
                height: 5
            }),
            solid(),
            'wall'
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
            height: 46
        }),
        body(),
        {
            speed: 0,
            flip: false,
            dead: false,
            sleeping: opt.sleeping ? opt.sleeping : false,
            lays: false,
            firstMoved: false,
            isDown: opt.sleeping ? opt.sleeping : false,
            lastCheckpoint: null,
            canSuperWoof: DEBUG_SUPER_WOOF,
            canFire: DEBUG_CAN_FIRE,
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
                    player.lays = false
                    this.trigger('firstMoved')
                }
            },
            fire() {
                if (!this.canFire) return;
                debug.log(player.pos.x + ' ' + player.pos.y + ' ' + player.flip + ' ' + player.width)
                const fire = add([
                    sprite('fire', {
                        flipX: player.flip,
                        anim: 'fire'
                    }),
                    pos(player.pos.add(player.flip?0:player.width, (player.isDown ? 80 : 36))),
                    origin(player.flip ? 'right' : 'left'),
                    area(),
                    lifespan(0.25, { fade: 0.2 }),
                    z(100),
                    'fire'
                ])
                fire.onUpdate(() => {
                    fire.pos = player.pos.add(player.flip?0:player.width, (player.isDown ? 80 : 36))
                    fire.flipX(player.flip)
                    fire.origin = player.flip ? 'right' : 'left'
                })
            }
        },
        z(50),
        'player'
    ]);
    player.layArea()
    player.onUpdate(() => {
        // stand up after narrow corridor
        if (!player.dead && !player.sleeping && player.isDown && !isKeyDown('s') && !isKeyDown('down') && canStand(player)) {
            // copied from onKeyRelease('down')
            player.isDown = false;
            if (player.curPlatform()) {
                if (player.speed) {
                    player.speed = (player.flip ? -1 : 1) * (player.isDown ? CRAWL_SPEED : SPEED)
                    player.play(player.isDown ? 'crawl' : 'run')
                } else {
                    player.play(player.isDown ? 'lay' : 'idle')
                }
                player.isDown ? player.layArea() : player.resetArea()
            }
        }

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
        if (player.dead || player.isDown && !canStand(player) && !player.lays) return;
        if (player.curPlatform()) {
            if (player.sleeping) {
                player.sleeping = false

                player.lays = true
                player.play('lay')
                player.layArea()
                return
            }
            player.handleFirstMoved()
            player.jump()
            player.play('jump')
            player.resetArea()
            player.isDown = false
        }
    })
    onKeyPress(['s', 'down'], () => {
        player.isDown = true
        if (player.dead || player.sleeping || player.lays) return;
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
        player.isDown = !canStand(player)
        if (player.dead || player.sleeping) return;
        if (player.curPlatform()) {
            if (player.speed) {
                player.speed = (player.flip ? -1 : 1) * (player.isDown ? CRAWL_SPEED : SPEED)
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

    onKeyPress("f", (c) => {
        fullscreen(!isFullscreen())
    })

    onKeyPress(['q'], () => {
        if (player.dead || player.sleeping || !player.canSuperWoof) return;
        play('woof')
        shake(2)
        multiWave(player)
    })

    onKeyPress(['e'], () => {
        if (player.dead || player.sleeping || !player.canFire) return;
        // play('fire')
        player.fire()
    })

    return player
}

function canStand(player) {
    if (player.lays) return false;

    const standArea = player.flip ? {
        offset: vec2(40, 40),
        width: 47,
        height: 46
    } : {
        offset: vec2(22, 40),
        width: 47,
        height: 46
    }

    player.solid = false
    const px = player.pos.x + player.area.offset.x;
    const py = player.curPlatform() ? player.curPlatform().pos.y : player.pos.y + player.area.offset.y + player.area.height;
    const tmp = add([
        pos(px, py),
        origin("botleft"),
        area(),
        solid(),
        rect(standArea.width, standArea.height)
    ])
    tmp.moveBy(0, 0)    // using moveBy instead of pushOutAll because moveBy checks if colliding object is solid
    player.solid = true
    let res = tmp.pos.dist(px, py) <= 2
    destroy(tmp)
    return res
}

function wave(player)
{
    const wave = add([
        sprite('wave', {
            flipX: player.flip
        }),
        pos(vec2(player.pos.add(player.flip?0:player.width, (player.isDown ? 80 : 36)))),
        origin(player.flip ? 'left' : 'right'),
        area(),
        outview(),
        opacity(0.8),
        scale(),
        z(100),
        lifespan(0.3, {fade: 1}),
        'woof'
    ])
    const speed = 800
    let scalex = 1
    let scaley = 1
    let dir = player.flip ? -1 : 1
    wave.onUpdate(() => {
        wave.moveBy(dir*speed*dt(), -wave.height/2*1.5*dt())
        wave.scaleTo(scalex += dt()/2, scaley += 3*dt())
    })
    wave.onExitView(() => {
        wave.destroy()
    })
    // wave.onCollide('deflatable', (d) => {
    //     d.move(dir*200*this.opacity**2, 0)
    // })
}

function multiWave(player, m = 3)
{
    for (let i = 0; i < m; i++) {
        wait(0.05 * i, () => wave(player))
    }
}

