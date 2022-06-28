import {H, SHOW_TILE_INDEX, W} from "./init";

const PLAYER_SPEED = 400;

export function addTiles(tiles, opt) {

    tiles.forEach((Tiles, i) => {
        Tiles.forEach((tile, j) => {
            const name = typeof tile === 'string' ? tile : tile.name;
            const t = add([
                pos(j * W, i * H),
                sprite(name),
                z(-1)
            ])

            // floor
            add([
                pos(t.pos.x, t.pos.y + H - (opt.floor ? opt.floor : 8)),
                rect(W, 10),
                opacity(0),
                area(),
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

}

export function setupCamera(player) {
    camPos(vec2(Math.max(player.pos.x + player.width/2 + (player.flip ? 80 : -80)), camPos().y))
    // let scale = 1000
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

export function addPlayer(opt) {
    const player = add([
        pos(opt.x, opt.y),
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
            dead: opt.dead ? opt.dead : false,
        },
        scale(1.5),
        z(50),
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
