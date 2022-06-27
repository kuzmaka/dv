import {W, H, SKIP_CUTS} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {

    let heart;

    const light = add([
        pos(0),
        sprite('light'),
        z(0),
    ])
    light.hidden = true

    let darkAreas = [];
    function inDarkArea(x) {
        return !!darkAreas.find(area => area[0] <= x && x <= area[1])
    }

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
            {
                name: 'lab-dock',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    tile.play('close')
                    darkAreas.push([x + 300, x + W])

                    // door
                    tile.onUpdate(() => {
                        tile.play( x + 250 < player.pos.x + player.width && player.pos.x < x + 430 ? 'open' : 'close')
                    })
                }
            },
            {
                name: 'dock1',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x+W])
                    // floor
                    add([
                        pos(x+451, y+296),
                        area({width: W-451, height: 100}),
                        solid()
                    ])
                }
            },
            {
                name: 'ship0',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x+W])
                    // floor
                    add([
                        pos(x, y),
                        sprite('ship0'),
                        area(),
                        z(100)
                    ])
                    add([
                        pos(x, y+H-64),
                        area({width: W, height: 100}),
                        solid()
                    ])
                    add([
                        pos(x+300, y+H-140),
                        area({width: 220, height: 100}),
                        solid()
                    ])
                    add([
                        pos(x+300, y+H-110),
                        area({width: W-300, height: 100}),
                        solid()
                    ])
                }
            }
        ]
    ];
    addTiles(tiles, {
        floor: 8
    })

    const player = addPlayer({
        x: 330,
        y: 180,
        dead: true
    })

    const cancel = player.onUpdate(() => {
        if (!player.dead && heart) {
            heart.play('off')
            cancel()
        }
    })
    player.onUpdate(() => {
        light.hidden = !inDarkArea(player.pos.x)
        light.moveTo(player.pos)
    })

    setupCamera(player)

    let background = add([
        pos(0),
        sprite('sky-night'),
        z(-100)
    ])
    // update background pos after camera pos updated to avoid jitter
    player.onUpdate(() => {
        background.pos = camPos().sub(width()/2, height()/2)
    })

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
