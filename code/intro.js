import {W, H, SKIP_CUTS} from './init'

export default () => {
    add([
        pos(0),
        sprite('lab0')
    ])
    // floor
    add([
        pos(0, H - 8),
        rect(W, 100),
        opacity(0),
        area(),
        solid()
    ])
    // bed
    add([
        pos(345, 291),
        rect(88, 10),
        opacity(0),
        area(),
        solid()
    ])

    addPlayer()

    if (!SKIP_CUTS) {
        wakeUp()
    }
}

function addPlayer()
{
    const player = add([
        pos(348, 251),
        sprite("dog", {
            anim: 'dead',
            flipX: true
        }),
        area({
            offset: vec2(10, 20),
            width: 54,
            height: 35
        }),
        body(),
        {
            speed: 0,
            flip: true,
            dead: true
        },
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

    const SPEED = 250;
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
