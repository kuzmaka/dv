import {
    H,
    DEBUG_SHOW_TILE_INDEX,
    W,
    gameState
} from "./init";
import {checkpoint, fade, wiggle} from "./components";

const PLAYER_SPEED = 400;

function addUIElement(name, x, y) {
    add([
        layer('ui'),
        pos(x, y),
        origin('center'),
        sprite(name),
        fixed(),
        scale(),
        wiggle(3),
    ])
}

export function addUI() {
    layers([
        'game',
        'ui',
    ], 'game')

    const cnc1 = onUpdate(() => {
        if (gameState.canSuperWoof) {
            addUIElement('hint-q', 20, 15)
            cnc1()
        }
    })

    const cnc2 = onUpdate(() => {
        if (gameState.canFire) {
            addUIElement('hint-e', 20, 41)
            cnc2()
        }
    })

    const cnc3 = onUpdate(() => {
        if (gameState.hasBlueKey) {
            addUIElement('blue-key', width() - 15, 15)
            cnc3()
        }
    })

    const cnc4 = onUpdate(() => {
        if (gameState.hasRedKey) {
            addUIElement('red-key', width() - 41, 15)
            cnc4()
        }
    })
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
                    pos(j * W, i * H + 10),
                    area({
                        width: W,
                        height: H - 20
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
            pos(0, H),  // no wall for lift
            area({
                width: opt.lwall,
                height: tiles.length * (H-1)
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
            flipX: !!opt.flip
        }),
        area({
            offset: vec2(22, 40),
            width: 47,
            height: 46
        }),
        body(),
        {
            speed: 0,
            flip: !!opt.flip,
            dead: false,
            sleeping: opt.sleeping ? opt.sleeping : false,
            lays: false,
            firstMoved: false,
            isDown: opt.sleeping ? opt.sleeping : false,
            lastCheckpoint: {playerPos: vec2(opt.x, opt.y), flip: !!opt.flip},
            onRespawn: [],
            cdFire: 0,
            cdWoof: 0,
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
                    pos(toWorld(vec2(0, 0).sub(W, H))),
                    rect(4*W + 200, 4*H + 200),
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
                    player.onRespawn.forEach((f) => {f()})
                    player.dead = false
                    player.firstMoved = false
                    player.speed = 0
                    player.play('idle')
                    shade.destroy()
                    hint.destroy()
                    player.moveTo(player.lastCheckpoint.playerPos)
                    player.flipX(player.flip = player.lastCheckpoint.flip)
                    player.resetArea()
                    this.camSetup()
                    setupCamera(player)
                    player.trigger('respawned')
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
            woof() {
                if(this.cdWoof > 0) {
                    play('onCooldown')
                    return
                }
                play('woof')
                shake(2)
                multiWave(player)
                this.cdWoof = 3
            },
            fire() {
                if (!gameState.canFire) return;
                if(this.cdFire > 0) {
                    play('onCooldown')
                    return
                }
                play('fire')
                const fire = add([
                    sprite('fire', {
                        flipX: player.flip,
                        anim: 'fire'
                    }),
                    pos(player.pos.add(player.flip?0:player.width, (player.isDown ? 80 : 36))),
                    origin(player.flip ? 'right' : 'left'),
                    area({
                        width: 200,
                        height: 70
                    }),
                    lifespan(0.25, { fade: 0.2 }),
                    z(100),
                    'fire'
                ])
                fire.onUpdate(() => {
                    fire.pos = player.pos.add(player.flip?0:player.width, (player.isDown ? 80 : 36))
                    fire.flipX(player.flip)
                    fire.origin = player.flip ? 'right' : 'left'
                })
                fire.onCollide('enemy', (e) => {
                    e.hurt(2)
                })
                this.cdFire = 3
            },
            update() {
                if(this.cdFire > 0) this.cdFire -= dt()
                if(this.cdWoof > 0) this.cdWoof -= dt()
            }
        },
        z(50),
        'player'
    ]);
    player.layArea()
    let touchDown = false;
    player.onUpdate(() => {
        // stand up after narrow corridor
        if (!player.dead && !player.sleeping && player.isDown && !isKeyDown('s') && !isKeyDown('down') && !touchDown && canStand(player)) {
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
    function moveLeft() {
        if (player.dead || player.sleeping) return;
        player.handleFirstMoved()
        player.speed = player.isDown ? -CRAWL_SPEED : -SPEED;
        player.flipX(player.flip = true)
        if (player.curPlatform()) {
            player.play(player.isDown ? 'crawl' : 'run')
            player.isDown ? player.layArea() : player.resetArea()
        }
    }
    function moveRight() {
        if (player.dead || player.sleeping) return;
        player.handleFirstMoved()
        player.speed = player.isDown ? CRAWL_SPEED : SPEED;
        player.flipX(player.flip = false)
        if (player.curPlatform()) {
            player.play(player.isDown ? 'crawl' : 'run')
            player.isDown ? player.layArea() : player.resetArea()
        }
    }
    function stop() {
        if (player.dead || player.sleeping) return;
        if (player.speed !== 0) {
            player.speed = 0
            if (player.curPlatform()) {
                player.play(player.isDown ? 'lay' : 'idle')
                player.isDown ? player.layArea() : player.resetArea()
            }
        }
    }
    function jump() {
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
    }
    function down() {
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
    }
    function undown() {
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
    }
    function woof() {
        if (player.dead || player.sleeping || !gameState.canSuperWoof) return;
        player.woof()
    }
    function fire() {
        if (player.dead || player.sleeping || !gameState.canFire) return;
        player.fire()
    }
    onKeyPress(['a', 'left'], moveLeft)
    onKeyRelease(['a', 'left'], stop)
    onKeyPress(['d', 'right'], moveRight)
    onKeyRelease(['d', 'right'], stop)
    onKeyPress(['w', 'up', 'space'], jump)

    let touches = {}
    onTouchStart((id, p) => {
        touches[id] = {
            t: time(),
            p: p,
            s: null
        }
    })
    onTouchMove((id, p) => {
        if (!touches[id]) return;
        const touch = touches[id]
        if (touch.p.x - p.x > 20 && p.s !== 'left') {
            moveLeft()
            touch.s = 'left'
        }
        if (p.x - touch.p.x > 20 && p.s !== 'right') {
            moveRight()
            touch.s = 'right'
        }
        if (touch.p.y - p.y > 20) {
            touchDown = false
            jump()
            touch.p.y = p.y
        }
        if (p.y - touch.p.y > 20) {
            if (!touchDown) {
                touchDown = true
                down()
            }
            touch.p.y = p.y
        }
        if (Math.abs(touch.p.x - p.x) <= 20 && (p.s === 'left' || p.s === 'right')) {
            stop()
            touch.s = null
        }
    })
    onTouchEnd((id, p) => {
        if (!touches[id]) return;
        delete touches[id]
        touchDown = false
        stop()

        if (gameState.canSuperWoof && p.x + 2 > 20 && p.x - 2 < 20 + 31 && p.y + 2 > 15 && p.y - 2 < 15 + 22) {
            woof()
        }
        if (gameState.canFire && p.x + 2 > 20 && p.x - 2 < 20 + 31 && p.y + 2 > 41 && p.y - 2 < 41 + 22) {
            fire()
        }
    })

    onKeyPress(['s', 'down'], down)
    onKeyRelease(['s', 'down'], undown)
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

    onKeyPress(['q'], woof)
    onKeyPress(['e'], fire)

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
    wave.onCollide('deflatable', (d) => {
        // d.move(dir*200*this.opacity**2, 0)

        // if (d.t0 && time() - d.t0 < 3) return;
        // d.t0 = time()
        // const cnc = d.onUpdate(() => {
        //     if (time() - d.t0 < 2) {
        //         d.moveBy(0, 1 * (time()-d.t0)**2 - 20*(time()-d.t0))
        //     } else {
        //         cnc()
        //     }
        // })
    })
}

function multiWave(player, m = 3)
{
    for (let i = 0; i < m; i++) {
        wait(0.05 * i, () => wave(player))
    }
}

