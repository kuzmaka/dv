import {W, H, SKIP_CUTS} from './init'
import {addTiles} from "./addTiles";

const PLAYER_SPEED = 400;

export default () => {

    let heart;

    const tiles = [
        [
            {
                name: 'lab0',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    // heart monitor
                    heart = add([
                        pos(x + 360, y + 160),
                        sprite('heart', {anim: 'on'})
                    ])
                    // bed collision box
                    add([
                        pos(x + 345, y + 291),
                        area({
                            width: 88,
                            height: 10
                        }),
                        solid()
                    ])
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    // some parkour stuff :)
                    // for (let k=0; k < 5; k++) {
                    //     add([
                    //         pos(randi(j * W, (j + 1) * W), randi(80, H - 80)),
                    //         rect(100, 10),
                    //         color(BLACK),
                    //         opacity(0.5),
                    //         area(),
                    //         solid(),
                    //         z(100)
                    //     ])
                    // }
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    add([
                        pos(x + 150, y + H - 8),
                        origin('botleft'),
                        sprite('doggy')
                    ])
                    add([
                        pos(x + 100, y + H - 8),
                        origin('botleft'),
                        sprite('cage')
                    ])
                }
            },
            'lab2-exit',
            'lab1'
        ]
    ];
    addTiles(tiles)

    const player = addPlayer()

    const cancel = player.onUpdate(() => {
        if (!player.dead) {
            heart.play('off')
            cancel()
        }
    })

    setupCamera(player)

    if (!SKIP_CUTS) {
        wakeUp()
    }
}

function setupCamera(player) {
    camPos(vec2(Math.max(player.pos.x + player.width/2 + (player.flip ? 80 : -80)), camPos().y))
    // let scale = 100
    player.onUpdate(() => {
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
        const from = camPos().x
        const to = Math.max(player.pos.x + player.width/2 + (player.flip ? 80 : -80))
        camPos(vec2(from + Math.sign(to-from)*Math.min(Math.abs(to - from), 1.5*PLAYER_SPEED*dt()), camPos().y))
    })
}

function addPlayer() {
    const player = add([
        pos(330, 180),
        sprite("dog", {
            anim: 'dead',
            flipX: true
        }),
        area({
            offset: vec2(20, 30),
            width: 40,
            height: 35
        }),
        body(),
        {
            speed: 0,
            flip: true,
            dead: true,
        },
        scale(1.5),
        'player'
    ]);
    player.flipX(player.flip = true)
    player.onUpdate(() => {
        if (player.speed) {
            player.move(player.speed, 0)
        }
        // if (player.curAnim() !== 'fall' && !player.curPlatform() && player.isFalling()) {
        //     player.play('fall')
        // }
    })

    const SPEED = PLAYER_SPEED;
    onKeyPress('left', () => {
        if (player.dead) return;
        player.speed = -SPEED
        player.flipX(player.flip = false)
        if (player.curPlatform()) {
            player.play('run')
        }
    })
    onKeyRelease('left', () => {
        if (player.dead) return;
        if (player.speed < 0) {
            player.speed = 0
            if (player.curPlatform()) {
                player.play('idle')
            }
        }
    })
    onKeyPress('right', () => {
        if (player.dead) return;
        player.speed = SPEED
        player.flipX(player.flip = true)
        if (player.curPlatform()) {
            player.play('run')
        }
    })
    onKeyRelease('right', () => {
        if (player.dead) return;
        if (player.speed > 0) {
            player.speed = 0
            if (player.curPlatform()) {
                player.play('idle')
            }
        }
    })
    onKeyPress(['up', 'space'], () => {
        if (player.curPlatform()) {
            if (player.dead) {
                player.dead = false
                player.play('lay')
            } else {
                player.jump()
                player.play('jump')
            }
        }
    })
    onKeyPress(['down'], () => {
        if (player.dead) return;
        if (player.curPlatform()) {
            player.play('lay')
        }
    })
    player.onGround(() => {
        player.play(player.speed ? 'run' : (player.dead ? 'dead' : 'idle'))
    })
    return player
}

function wakeUp() {
    const cover1 = add([
        pos(0),
        rect(W, H),
        color(WHITE),
        opacity(1)
    ])
    const cover2 = add([
        pos(0),
        rect(W, H),
        color(BLACK),
        opacity(1)
    ])
    let dizzed = false
    const cancel = onUpdate(() => {
        if (cover2.opacity > 0) {
            cover2.opacity = Math.max(0, cover2.opacity - 0.3*dt())
        } else {
            if (cover1.opacity > 0) {
                if (!dizzed) {
                    // camDizz()
                    dizzed = true
                }
                cover1.opacity = Math.max(0, cover1.opacity - 0.3 * dt())
            } else {
                cancel()
            }
        }
    })
}

function camDizz()
{
    let angle = 0
    let scale = 10
    const cancel = onUpdate(() => {
        if (angle < 360) {
            angle += 120 * dt()
        } else {
            angle = 360
        }
        if (scale > 1) {
            scale -= 3 * dt()
        } else {
            scale = 1
        }
        camRot(angle)
        camScale(scale)
        if (angle === 360 && scale === 1) {
            camRot(0)
            cancel()
        }
    })
}
