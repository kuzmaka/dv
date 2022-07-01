import {W, H, DEBUG_NO_ALARM, DEBUG_NO_SLEEP, DEBUG_RED_KEY} from './init'
import {addPlayer, addTiles, addUI, setupCamera} from "./createLevel";
import {fade, jitter, myLifespan, swing} from "./components";
import {addContainer, addLift, goto} from "./functions";

export default ({final, hasBlueKey}) => {

    let heart;
    let isAlarm = false;
    let lab2ExitTile;
    let hasRedKey = DEBUG_RED_KEY;
    let playerStartPos;
    let liftTilePos;
    let switchSnowAtX;

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

    const hintQ = addUI()

    const tiles = [
        [
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    liftTilePos = tile.pos

                    // ceil
                    add([
                        pos(x, y),
                        area({
                            width: W,
                            height: 8
                        }),
                        solid()
                    ])

                    // cabinet
                    add([
                        pos(x + 400, y + 160-8),
                        sprite('cabinet-bottles'),
                        area({
                            height: 60
                        }),
                        solid()
                    ])

                    // supepper
                    const supepper = add([
                        pos(x + 200, y + 40),
                        sprite('supepper'),
                        origin('center'),
                        area(),
                        swing()
                    ])
                    supepper.onCollide('player', () => {
                        play('score')
                        supepper.destroy()
                        player.canSuperWoof = true
                        hintQ.opacity = 1
                    })

                    // door to lift with lock
                    add([
                        pos(x + 24, y + 275),
                        sprite('bluelock')
                    ])
                    if (!hasBlueKey) {
                        add([
                            pos(tile.pos.add(0, H-8)),
                            origin('botleft'),
                            area({
                                width: 8,
                                height: H-8
                            }),
                            solid()
                        ])
                        add([
                            pos(x, y),
                            origin("topright"),
                            rect(W, H),
                            color(BLACK),
                            opacity(0.7),
                            z(1000)
                        ])
                    }
                }
            },
            {
                name: 'lab0',
                checkpoint: vec2(330, 180),
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    playerStartPos = vec2(x + 330, y + 180)

                    // heart monitor
                    heart = add([
                        pos(x + 360, y + 160),
                        sprite('heart', {anim: 'on'})
                    ])
                    add([
                        pos(x, y),
                        sprite('xray'),
                        z(1)
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
                            height: 50
                        }),
                        solid()
                    ])
                    // xray collision box
                    add([
                        pos(x + 15, y + H),
                        origin('botleft'),
                        area({
                            width: 120,
                            height: 75
                        }),
                        solid()
                    ])

                    // gas
                    let gx = x+170
                    addGrille(gx, y+310)
                    addGasArea(gx, y+310, 50)
                    addGrille(gx, y+260)
                    addGasArea(gx, y+260, 50)
                }
            },
            {
                name: 'lab1-window',
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
                name: 'lab1-window',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    // cabinet
                    add([
                        pos(x + 300, y + 160-8),
                        sprite('cabinet'),
                        area({
                            height: 60
                        }),
                        solid()
                    ])
                }
            },
            {
                name: 'lab1-window',
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
                name: 'lab1-window',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    addDoggyInCage(x+120, y, sprite('doggy', {anim: 'sit'}))
                    addDoggyInCage(x + 280, y, sprite('doggy', {anim: 'stay'}))
                    addDoggyInCage(x + 440, y, sprite('dog2', {anim: 'tongue'}))
                    addDoggyInCage(x + 600, y, sprite('dog3', {quad: quad(0, 0, 1, 0.87)}))
                }
            },
            {
                name: 'lab1-window',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    // playerStartPos = vec2(x + 10, y + 10)
                    addBox(x+225, y+300)
                    addBox(x+260, y+300)
                    addBox(x+300, y+300)
                    addBox(x+335, y+300)
                    addBox(x+380, y+300)
                    addBox(x+270, y+200)
                    addBox(x+316, y+200)
                    addBox(x+355, y+200)
                }
            },
            {
                name: 'lab1-window',
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
            },
            /*{
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
            },*/
            {
                name: 'lab-dock',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    tile.play('close')
                    darkAreas.push([x + 300, x + W])

                    // playerStartPos = vec2(x + 10, y + 10)

                    // door
                    const door = add([
                        pos(x + 306, y),
                        origin('top'),
                        area({
                            width: 70,
                            height: H,
                        }),
                        solid()
                    ])
                    // tile.onUpdate(() => {
                    //     // auto open door
                    //     tile.play( x + 250 < player.pos.x + player.width && player.pos.x < x + 430 ? 'left' : 'close')
                    // })
                    door.onCollide('woof', () => {
                        tile.play(player.pos.x + player.width/2 < 306 ? 'left' : 'right')
                        door.destroy()
                    })

                    // boxes
                    addBox(x + 500, y + 200)
                    addBox(x + 500 + 32, y + 200)
                    addBox(x + 500 + 32 + 32, y + 200)
                    addBox(x + 500, y + 100)
                    addBox(x + 500 + 32, y + 100)
                    addBox(x + 500 + 32 + 32, y + 100)
                }
            },
            {
                name: 'dock1',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x+W])
                    switchSnowAtX = x
                    // floor
                    add([
                        pos(x+451, y+296),
                        area({width: W-451, height: 100}),
                        solid()
                    ])
                    // boxes
                    add([
                        pos(x+375, y+320),
                        area({
                            width: 68,
                            height: 32
                        }),
                        solid()
                    ])
                }
            },
            {
                name: 'dock2',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    darkAreas.push([x, x+W])

                    // boxes
                    add([
                        pos(x+119, y+232),
                        area({
                            width: 78,
                            height: 32
                        }),
                        solid()
                    ])
                    add([
                        pos(x+111, y+264),
                        area({
                            width: 104,
                            height: 32
                        }),
                        solid()
                    ])

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
            },
            {
                name: 'empty',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x + W])
                }
            },
            {
                name: 'empty',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x + W])
                }
            },
            {
                name: 'empty',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x + W])
                }
            }
        ],
        [
            {
                name: 'lab1',
                onAdded(tile, i, j) {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    add([
                        pos(x+W, y),
                        origin('topright'),
                        sprite('doorwall', {flipX: true}),
                    ])
                    add([
                        pos(x+W, y),
                        origin('topleft'),
                        sprite('doorwall'),
                    ])

                    const door = add([
                        pos(x+W, y+H-8),
                        origin('bot'),
                        sprite('door', {anim: 'close'}),
                        area({
                            width: 70,
                            height: H-50,
                        }),
                        solid()
                    ])
                    door.onCollide('woof', () => {
                        door.play(player.pos.x + player.width/2 < door.pos ? 'left' : 'right')
                        door.solid = false
                    })

                    add([
                        pos(x + W/2, y + 190),
                        origin('top'),
                        sprite('blueprint')
                    ])
                }
            },
            {
                // name: 'lab-final',
                name: 'lab1',
                // checkpoint: vec2(20, H-110),
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    // right wall
                    add([
                        pos(x + W - 8, y),
                        area({
                            width: 8,
                            height: H - 8
                        }),
                        solid()
                    ])

                    // boss
                    add([
                        pos(x + W-8-320, y + H-8-194),
                        sprite('lab-boss', {anim: 'move'}),
                        area({
                            height: 182
                        }),
                        body()
                    ])
                }
            }
        ]
    ];
    addTiles(tiles, {
        floor: 8,

    })

    let player;
    if (final) {
        // TODO: player spawns in dock location
        // player = addPlayer({
        //     x: lab2ExitTile.pos.x + 100,
        //     y: H - 94,
        // })
        //
        // // fade in
        // add([
        //     pos(lab2ExitTile.pos.x - W, lab2ExitTile.pos.y - H),
        //     rect(3*W, 3*H),
        //     fade(0.5, {from: 1, to: 0}),
        //     color(BLACK),
        //     z(1000)
        // ])
    } else {
        player = addPlayer({
            x: playerStartPos.x,
            y: playerStartPos.y,
            sleeping: !DEBUG_NO_SLEEP
        })

        // fade in
        add([
            pos(player.pos.x-W, player.pos.y-H),
            rect(3*W, 3*H),
            fade(2, {from: 1, to: 0}),
            color(BLACK),
            z(1000)
        ])

        player.on('firstMoved', () => {
            heart.play('off')
            isAlarm = !DEBUG_NO_ALARM
        })
    }

    addLift(liftTilePos, player, 'liftwall')

    player.onUpdate(() => {
        light.hidden = !inDarkArea(player.pos.x)
        light.moveTo(player.pos)
    })

    player.onCollide('cage', (cage) => {
        cage.collision = true
    })

    player.onCollide('container', () => {
        goto('city', 1)
    })

    setupCamera(player)

    // sky
    add([
        pos(0),
        sprite('sky-violet'),
        z(-100),
        fixed()
    ])
    // snow
    const snow = add([
        pos(0),
        sprite('snow', {anim: 'letitsnow'}),
        z(-99),
        fixed()
    ])
    snow.onUpdate(() => {
        snow.z = player.pos.x > switchSnowAtX ? 100 : -99;
    })

    function addBox(x, y) {
        add([
            pos(x, y),
            sprite('box'),
            origin('center'),
            area(),
            body()
        ])
    }

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
                    opacity(0.4),
                    z(2)
                ])
            }
            if (player.isColliding(gasCircle)) {
                player.die()
            }
        })
    }

    function addDoggyInCage(x, y, _sprite) {
        let isFree = false;
        const doggy = add([
            pos(x, H-8),
            origin('bot'),
            _sprite,
            area(),
            outview(),
            jitter(),
            'doggy'
        ])

        // jumping for non-solid object
        let timer = 0;
        const dur = 1;
        doggy.onUpdate( () => {
            if (isFree) {
                timer += dt()
                if (timer > 1) {
                    timer = 0
                }
                // doggy.moveTo(vec2(x, H-8+10*Math.sin(time()*5)))
                doggy.moveTo(vec2(x, H-8 - 200*(dur-timer)*timer))
            } else {
                doggy.flipX(player.pos.x < doggy.pos.x)
            }
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
                    isFree = true
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

        const seagull = add([
            pos(x+318, y+94),
            origin('bot'),
            sprite('seagull'),
            z(101)
        ])
        seagull.onUpdate(() => {
            seagull.flipX(player.pos.x + player.width/2 < seagull.pos.x)
        })

        // floor
        const f1 = add([
            pos(x+300, y + H-130),
            area({width: 220, height: 50}),
            solid()
        ])
        const f2 = add([
            pos(x+300+220, y+H-140+40),
            area({width: 120+2*W, height: 50}),
            solid()
        ])
        // container
        const containers = [];
        for (let i = 0; i < 3; i++) {
            const dx = 2*W-400+288*i;
            for (let j = 0; j < 3; j++) {
                const dy = 133 - 127*j;
                containers.push({
                    obj: addContainer(x +dx, y+dy, i === 2),
                    dp: vec2(dx, dy)
                })
            }
        }
        const cnc = ship.onUpdate(() => {
            // departure after player jumps to ship
            if (player.pos.x > x+300) {
                ship.move(100, 0)
                seagull.moveTo(ship.pos.add(318, 94))
                f1.moveTo(ship.pos.add(300, 230))
                f2.moveTo(ship.pos.add(520, 260))
                containers.forEach((container) => {
                    container.obj.moveTo(ship.pos.add(container.dp))
                })
            }
            // stop after one tile
            if (ship.pos.x > x + W) {
                cnc()
            }
        })
    }
}
