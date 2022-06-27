import {W, H, SKIP_CUTS} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [
            {
                name: 'lab0',
                onAdded: (tile, i, j) => {
                    // bed collision box
                    add([
                        pos(tile.pos.x + 345, tile.pos.y + 291),
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
    addTiles(tiles, {
        floor: 8
    })

    const player = addPlayer(330, 180)

    setupCamera(player)

    if (!SKIP_CUTS) {
        wakeUp()
    }
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
