import {W, H} from './init'
import {addPlayer, addTiles, setupCamera} from "./createLevel";
import {fade, jitter, myLifespan, swing} from "./components";
import {goto} from "./functions";

export default ({final, hasBlueKey}) => {

    let heart;
    let isAlarm = false;
    let lab2ExitTile;
    let hasRedKey = true;

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
                checkpoint: vec2(330, 180),
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    // heart monitor
                    heart = add([
                        pos(x + 360, y + 160),
                        sprite('heart', {anim: 'on'})
                    ])
                    add([
                        pos(x, y),
                        sprite('lamp')
                    ])
                    // bed collision box
                    add([
                        pos(x + 345, y + 291),
                        area({
                            width: 88,
                            height: 30
                        }),
                        solid()
                    ])
                    // left wall
                    add([
                        pos(x, y),
                        area({
                            width: 8,
                            height: H
                        }),
                        solid()
                    ])
                    add([
                        pos(x, y + H),
                        origin('botleft'),
                        area({
                            width: 120,
                            height: 90
                        }),
                        solid()
                    ])
                    add([
                        pos(x,y),
                        origin('topright'),
                        rect(W, H),
                        color(BLACK)
                    ])

                    // boost
                    add([
                        pos(x + 40, y + 225),
                        sprite('supepper'),
                        origin('center'),
                        swing()
                    ])

                    // gas
                    let gx = x+170
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    let gx = x+100
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                    gx = x + 320
                    addGrille(gx, y+260)
                    addGasArea(gx, y+260, 50)
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    let gx = x + 100
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                    gx = x + 340
                    addGrille(gx, y+260)
                    addGasArea(gx, y+260, 50)
                    gx = x + 580
                    addGrille(gx, y+260)
                    addGasArea(gx, y+260, 50)
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addDoggyInCage(x, y, sprite('doggy', {anim: 'sit'}))
                    addDoggyInCage(x + 160, y, sprite('doggy', {anim: 'stay'}))
                    addDoggyInCage(x + 320, y, sprite('dog2', {anim: 'tongue'}))
                    addDoggyInCage(x + 480, y, sprite('dog3', {quad: quad(0, 0, 1, 0.87)}))
                }
            },
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    let gx = x + 100
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                    gx = x + 340
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                    gx = x + 580
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                }
            },*/
            {
                name: 'lab2-exit',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    lab2ExitTile = tile

                    // door
                    const door = add([
                        pos(x + 82 + 30, y + 188),
                        area({
                            width: 87 - 30,
                            height: 165
                        })
                    ])
                    let justArrived = true;
                    const cancel1 = door.onUpdate(() => {
                        if (justArrived) {
                            if (!door.isColliding(player)) {
                                justArrived = false;
                                cancel1()
                            }
                        }
                    })
                    const cancel2 = door.onCollide('player', (p) => {
                        if (justArrived) return;

                        if (hasBlueKey) {
                            player.hidden = true
                            goto('lab-final')
                            cancel2()
                        }
                    })
                }
            },
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
                name: 'dock2',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x+W])
                    // floor
                    add([
                        pos(x, y),
                        sprite('dock2'),
                        area(),
                    ])
                    add([
                        pos(x, y+H-64),
                        area({width: 339, height: 100}),
                        solid()
                    ])
                    addShip(x, y)
                }
            }
        ]
    ];
    addTiles(tiles, {
        floor: 8,

    })

    let player;
    if (final) {
        player = addPlayer({
            x: lab2ExitTile.pos.x + 100,
            y: H - 94,
        })

        // fade in
        add([
            pos(lab2ExitTile.pos.x - W, lab2ExitTile.pos.y - H),
            rect(3*W, 3*H),
            fade(0.5, {from: 1, to: 0}),
            color(BLACK),
            z(1000)
        ])
    } else {
        player = addPlayer({
            x: 330,
            y: 180,
            sleeping: true
        })

        // fade in
        add([
            pos(-W, -H),
            rect(3*W, 3*H),
            fade(2, {from: 1, to: 0}),
            color(BLACK),
            z(1000)
        ])

        player.on('firstMoved', () => {
            heart.play('off')
            isAlarm = true
        })
    }

    player.onUpdate(() => {
        light.hidden = !inDarkArea(player.pos.x)
        light.moveTo(player.pos)
    })

    player.onCollide('cage', (cage) => {
        cage.collision = true
    })

    setupCamera(player)

    add([
        pos(0),
        sprite('sky-night', {anim: 'blink'}),
        z(-100),
        fixed()
    ])

    function addGrille(x, y) {
        add([
            pos(x, y),
            sprite('grille'),
            origin('center')
        ])
    }

    function addGasArea(x, y, r) {
        const gasArea = add([
            pos(x, y),
            origin('center'),
            area({width: 2*r, height: 2*r}),
            outview()
        ])

        // hack to check collision with circle
        const gasCircle = {
            exists() {return true},
            area: true,
            worldArea() {
                return {
                    shape: 'circle',
                    center: gasArea.pos,
                    radius: r
                }
            }
        }

        let t = 0;
        gasArea.onUpdate(() => {
            if (gasArea.isOutOfView() || !isAlarm) {
                return
            }
            t += dt()
            if (t > 0.02) {
                t = 0;
                const _r = rand(0, r);
                const _a = rand(0, 2*Math.PI);
                add([
                    // pos(x + rand(0, w), y + rand(0, w)),
                    pos(x + _r * Math.cos(_a), y + _r * Math.sin(_a)),
                    sprite('gas'),
                    origin('center'),
                    scale(rand(0.5, 2)),
                    myLifespan(1, {fade: 0.5, opacity: 0.4}),
                    move(rand(0, 360), rand(20, 60)),
                    rotate(rand(0, 360)),
                    opacity(0.4)
                ])
            }
            if (player.isColliding(gasCircle)) {
                player.die()
            }
        })
    }

    function addDoggyInCage(x, y, _sprite) {
        const doggy = add([
            pos(x, H-8),
            origin('bot'),
            _sprite,
            area(),
            outview(),
            jitter(),
            body(),
            'doggy'
        ])
        onUpdate('doggy', (doggy) => {
            doggy.flipX(player.pos.x < doggy.pos.x)
        })
        const cage = add([
            pos(x, y + H - 8),
            origin('bot'),
            sprite('cage'),
            area(),
            {
                collision: false,
            },
            'cage'
        ])
        cage.onUpdate(() => {
            if (hasRedKey && cage.collision) {
                cage.moveTo(cage.pos.x, y + H + cage.height, 50)
                if (cage.pos.y > y + H + cage.height - 10) {
                    doggy.stopJitter()
                    if (doggy.curPlatform()) {
                        doggy.jump()
                    }
                }
            }
        })
    }

    function addShip(x, y) {
        const ship = add([
            pos(x, y),
            sprite('ship0'),
            z(100)
        ])
        // floor
        const f1 = add([
            pos(x+300, y + H-130),
            area({width: 220, height: 50}),
            solid()
        ])
        const f2 = add([
            pos(x+300+220, y+H-140+40),
            area({width: 120, height: 50}),
            solid()
        ])
        const cnc = ship.onUpdate(() => {
            // departure after player jumps to ship
            if (player.pos.x + player.width > x+300) {
                ship.move(100, 0)
                f1.moveTo(ship.pos.add(300, 230))
                f2.moveTo(ship.pos.add(520, 260))
            }
            // stop after one tile
            if (ship.pos.x > x + W) {
                cnc()
            }
        })
    }
}
