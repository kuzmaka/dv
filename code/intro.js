import {W, H, DEBUG_NO_ALARM, DEBUG_NO_SLEEP, DEBUG_HAS_RED_KEY, gameState, DEBUG_MODE} from './init'
import {addPlayer, addTiles, addUI, setupCamera} from "./createLevel";
import {checkpoint, fade, jitter, myLifespan, swing} from "./components";
import {
    addContainer,
    addHeli,
    addKey,
    addLift,
    addSuperFirePepper,
    addSuperWoofPepper,
    goto,
    shakeObj
} from "./functions";

export default ({final}) => {

    let heart;
    let isAlarm = false;
    let playerStartPos;
    let liftTilePos;
    let switchSnowAtX;
    let dockTilePos;
    let bossTilePos;

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

    addUI()

    const tiles = [
        [
            {
                name: 'lab1',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    liftTilePos = tile.pos

                    // ceil
                    // add([
                    //     pos(x, y),
                    //     area({
                    //         width: W,
                    //         height: 8
                    //     }),
                    //     solid()
                    // ])

                    // cabinet
                    add([
                        pos(x + 400, y + 159-8),
                        sprite(final? 'cabinet-final' : 'cabinet'),
                    ])

                    // door to lift with lock
                    add([
                        pos(x + 75, y + 100),
                        origin('top'),
                        sprite('lift-sign')
                    ])
                    add([
                        pos(x + 75, y + 255),
                        origin('top'),
                        sprite('bluelock'),
                    ])
                    const door = add([
                        pos(tile.pos.add(0, H-8)),
                        origin('botleft'),
                        area({
                            width: 8,
                            height: H-16
                        }),
                        solid()
                    ])
                    const fading = add([
                        pos(x, y),
                        origin("topright"),
                        rect(W, H),
                        color(BLACK),
                        opacity(0.7),
                        z(1000)
                    ])
                    tile.onUpdate(() => {
                        if (gameState.hasBlueKey && player.pos.x < 100) {
                            door.solid = false
                            fading.opacity = 0
                        } else {
                            door.solid = true
                            fading.opacity = 0.7
                        }
                    })
                }
            },
            {
                name: 'lab0',
                checkpoint: vec2(330, 180),
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // blue key
                    // addKey('blue', x+500, y+H-40)
                    // red key
                    // addKey('red', x+600, y+H-40)
                    // addSuperWoofPepper(x+600, y+H-40)

                    playerStartPos = vec2(x + 330, y + 180)

                    if (!final) {
                        // ketchup
                        add([
                            pos(x, y),
                            sprite('ketchup')
                        ])
                    }

                    // heart monitor
                    heart = add([
                        pos(x + 360, y + 160),
                        sprite('heart', {anim: final ? 'poweroff' : 'on'})
                    ])
                    add([
                        pos(x, y),
                        sprite('xray'),
                        z(1)
                    ])
                    add([
                        pos(x, y),
                        sprite(final ? 'lamp-off' : 'lamp')
                    ])
                    // bed collision box
                    add([
                        pos(x + 345, y + 291),
                        area({
                            width: 88,
                            height: 69
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

                    // open cage
                    add([
                        pos(x + 300, y + H-8),
                        sprite('cage-open'),
                        origin('botleft')
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
                    if (final) {
                        add([
                            pos(x + 440, y + H-8),
                            sprite('cage-open'),
                            origin('bot')
                        ])
                    } else {
                        addDoggyInCage(x + 440, y, sprite('dog2', {anim: 'tongue'}))
                    }
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
                    if (final) {
                        addBox(x + 286, y + 100)
                        addBox(x + 332, y + 100)
                        addBox(x + 308, y + 0)
                    }

                    if (!final) {
                        // checkpoint
                        add([
                            pos(x+316, y),
                            area({
                                width: 10,
                                height: H
                            }),
                            checkpoint(vec2(x+280, y+H-94-64))
                        ])
                    }
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
            {
                name: 'lab-dock',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    tile.play('close')
                    darkAreas.push([x + 300, x + W])

                    if (final) {
                        add([
                            pos(x + 122, y + 208),
                            sprite('photo')
                        ])
                    }

                    // super woof pepper
                    if (!final) {
                        addSuperWoofPepper(x + 122, y + H - 40)
                    }

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
                        tile.play(player.pos.x + player.width / 2 < x + 306 ? 'right' : 'left')
                        door.destroy()
                    })

                    // boxes
                    addBox(x + 500, y + 200)
                    addBox(x + 500 + 32, y + 200)
                    addBox(x + 500 + 32 + 32, y + 200)
                    if (!final) {
                        addBox(x + 500, y + 100)
                        addBox(x + 500 + 32, y + 100)
                        addBox(x + 500 + 32 + 32, y + 100)
                    }
                }
            },
            {
                name: 'dock',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];
                    darkAreas.push([x, x+W])
                    switchSnowAtX = x
                    dockTilePos = tile.pos

                    // checkpoint near heli
                    add([
                        pos(tile.pos.x + 260, y),
                        area({
                            width: 10,
                            height: H
                        }),
                        checkpoint(vec2(tile.pos.x + 260, y+H-94), final)
                    ])

                    if (!final) {
                        addBox(x+270+200, y+200)
                        addBox(x+316+200, y+200)
                        addBox(x+355+200, y+200)

                        addContainer(x+400+200, y+H-127-8, true)
                    }
                    // boxes
                    // add([
                    //     pos(x+375, y+320),
                    //     area({
                    //         width: 68,
                    //         height: 32
                    //     }),
                    //     solid()
                    // ])
                }
            },
            {
                name: 'dock-end',
                onAdded: (tile) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    // playerStartPos = vec2(x + 10, y + 10)

                    darkAreas.push([x, x+W])

                    // boxes
                    // add([
                    //     pos(x+119, y+232),
                    //     area({
                    //         width: 78,
                    //         height: 32
                    //     }),
                    //     solid()
                    // ])
                    // add([
                    //     pos(x+111, y+264),
                    //     area({
                    //         width: 104,
                    //         height: 32
                    //     }),
                    //     solid()
                    // ])

                    // floor
                    // add([
                    //     pos(x, y),
                    //     sprite('dock2'),
                    //     area(),
                    // ])

                    // fence
                    add([
                        pos(x+320, y+H-8),
                        origin('botleft'),
                        area({
                            width: 12,
                            height: 45
                        }),
                        solid()
                    ])

                    tile.onUpdate(() => {
                        if (player.pos.x > x+338 && y+H-8 - (player.pos.y+player.area.offset.y+player.area.height) < 2) {
                            player.die()
                        }
                    })

                    if (!final) {
                        addShip(x, y)
                    }
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
                name: 'lab-final1',
                checkpoint: vec2(20, H-94),
            },
            {
                name: 'lab-final2',
                onAdded: (tile, i, j) => {
                    const [x, y] = [tile.pos.x, tile.pos.y];

                    bossTilePos = vec2(tile.pos)

                    // playerStartPos = vec2(x - 100, y + 200)

                    // right wall
                    add([
                        pos(x + W - 36, y),
                        area({
                            width: 40,
                            height: H - 8
                        }),
                        solid()
                    ])

                }
            }
        ]
    ];
    addTiles(tiles, {
        floor: 8,

    })

    var music = play('lab', {
        loop: true
    })

    let player;
    if (final) {
        const heli = addHeli(dockTilePos.add(200, H-1))

        if (!DEBUG_MODE) {
            player = addPlayer({
                x: heli.pos.x + 60,
                y: H - 94,
                flip: true
            })
        } else {
            player = addPlayer({
                x: playerStartPos.x,
                y: playerStartPos.y,
                flip: false
            })
        }
    } else {
        player = addPlayer({
            x: playerStartPos.x,
            y: playerStartPos.y,
            sleeping: !DEBUG_NO_SLEEP
        })

        player.on('firstMoved', () => {
            heart.play('off')
            isAlarm = !DEBUG_NO_ALARM
        })

        player.onUpdate(() => {
            light.hidden = !inDarkArea(player.pos.x)
            light.moveTo(player.pos)
        })

        player.onCollide('container', () => {
            goto('city', 1)
            music.stop()
        })
    }

    // fade in
    add([
        pos(player.pos.x-W, player.pos.y-H),
        rect(3*W, 3*H),
        fade(2, {from: 1, to: 0}),
        color(BLACK),
        z(1000)
    ])

    addLift(liftTilePos, player, false, {liftwall: 'liftwall'})

    setupCamera(player)

    // sky
    add([
        pos(0),
        sprite(final ? 'sunrise' : 'sky-violet'),
        z(-100),
        fixed()
    ])
    if (!final) {
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
    }

    function addBox(x, y) {
        add([
            pos(x, y),
            sprite('box'),
            origin('center'),
            area(),
            body(),
            'deflatable'
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
            'cage'
        ])
        let cageOpen = false;
        cage.onCollide('player', () => {
            cageOpen = gameState.hasRedKey;
        })
        const cnc = cage.onUpdate(() => {
            if (cageOpen) {
                cage.moveTo(cage.pos.x, y + H + cage.height, 50)
                if (cage.pos.y > y + H + cage.height - 10) {
                    doggy.stopJitter()
                    isFree = true;
                    gameState.freeDoggiesCount++;
                    if (gameState.freeDoggiesCount === 3) {
                        goto('win', 5)
                    }
                    cnc()
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
            // stop after one tile
            if (ship.pos.x > x + W) {
                return
            }
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
        })
        on('respawned', 'player', () => {
            ship.moveTo(x, y)
            seagull.moveTo(ship.pos.add(318, 94))
            f1.moveTo(ship.pos.add(300, 230))
            f2.moveTo(ship.pos.add(520, 260))
            containers.forEach((container) => {
                container.obj.moveTo(ship.pos.add(container.dp))
            })
            boss.setHP(10)
        })
    }

    // boss
    const bossHealth = 10
    let angle = 0;
    let bossDisappeared = false;
    const boss = add([
        pos(bossTilePos.add(W-8-320, H-8-182)),
        sprite('lab-boss', {anim: 'move'}),
        area({
            offset: vec2(40, 40),
            width: 260,
            height: 142,
        }),
        health(bossHealth),
        scale(),
        'enemy',
        {
            cdFire: 0,
            cdFire2: 2,
            deathTime: 0,
            fire() {
                const fire = add([
                    sprite('fire', {
                        flipX: true,
                        anim: 'fire'
                    }),
                    pos(boss.pos.add(30, 50)),
                    rotate(angle),
                    origin('right'),
                    lifespan(0.25, { fade: 0.2 }),
                    z(100),
                ])
                this.cdFire = 4

                // don't play music outside boss tile
                if (player.pos.x < bossTilePos.x-W || player.pos.x > bossTilePos.x+W
                    || player.pos.y < bossTilePos.y || player.pos.y > bossTilePos.y+H
                ) {
                    return
                }
                play('fire')
            },
            fire2() {
                const fire = add([
                    sprite('fire', {
                        flipX: true,
                        anim: 'fire'
                    }),
                    pos(boss.pos.add(62, 62)),
                    rotate(angle),
                    origin('right'),
                    lifespan(0.25, { fade: 0.2 }),
                    z(100),
                ])
                this.cdFire2 = 4

                // don't play music outside boss tile
                if (player.pos.x < bossTilePos.x - W || player.pos.x > bossTilePos.x+W
                    || player.pos.y < bossTilePos.y || player.pos.y > bossTilePos.y+H
                ) {
                    return
                }
                play('fire')
            },
            update() {
                // boss fires from his mouth
                let pa = boss.pos.add(30, 50)
                // to player center
                let pb = vec2(player.pos.add(player.width/2, player.height/2))
                // fire angle
                angle = -Math.acos((pa.x - pb.x) / pb.dist(pa)) / Math.PI * 180

                if (pa.dist(pb) < 80 && 3.75 <= this.cdFire && this.cdFire <= 3.75+0.0625
                    || pa.dist(pb) < 120 && 3.75+0.0625 <= this.cdFire && this.cdFire <= 3.75+0.0625*2
                    || pa.dist(pb) < 180 && 3.75+0.0625*2 <= this.cdFire && this.cdFire <= 3.75+0.0625*3
                    || pa.dist(pb) < 260 && 3.75+0.0625*3 <= this.cdFire && this.cdFire <= 4
                ) {
                    player.die()
                }

                if(this.cdFire > 0) {
                    this.cdFire -= dt()
                } else {
                    this.fire()
                }

                // fire 2
                // boss fires from his mouth
                pa = boss.pos.add(62, 62)
                // to player center
                pb = vec2(player.pos.add(player.width/2, player.height/2))
                // fire angle
                angle = -Math.acos((pa.x - pb.x) / pb.dist(pa)) / Math.PI * 180

                if (pa.dist(pb) < 80 && 3.75 <= this.cdFire2 && this.cdFire2 <= 3.75+0.0625
                    || pa.dist(pb) < 120 && 3.75+0.0625 <= this.cdFire2 && this.cdFire2 <= 3.75+0.0625*2
                    || pa.dist(pb) < 180 && 3.75+0.0625*2 <= this.cdFire2 && this.cdFire2 <= 3.75+0.0625*3
                    || pa.dist(pb) < 260 && 3.75+0.0625*3 <= this.cdFire2 && this.cdFire2 <= 4
                ) {
                    player.die()
                }

                if(this.cdFire2 > 0) {
                    this.cdFire2 -= dt()
                } else {
                    this.fire2()
                }



                if (this.hp()<=0 && time() - this.deathTime <= 3) {
                    boss.scaleTo(mapc(time(), this.deathTime, this.deathTime+3, 1, 0.3))
                }
                if (this.hp()<=0 && time() - this.deathTime > 3) {
                    bossDisappeared = true
                    boss.destroy()
                }
            },
            die() {
                this.deathTime = time()
                boss.cdFire = 999999
                boss.cdFire2 = 999999
                boss.play('stop')
                shakeObj(boss, 3, 50)
            }
        },
    ])
    boss.onCollide('fire', () => {
        if (boss.hp() <= 0) {
            boss.die()
        }
    })

    onDraw(() => {
        if (player.pos.x < bossTilePos.x - W || player.pos.x > bossTilePos.x+W
            || player.pos.y < bossTilePos.y || player.pos.y > bossTilePos.y+H
        ) {
            return
        }
        if (boss.hp() > 0) {
            drawRect({
                pos: camPos().add(-width()/2+100, -height()/2+20),
                width: boss.hp()/bossHealth*440,
                height: 16,
                color: rgb(0, 255, 0),
            });
            drawRect({
                pos: camPos().add(width()/2+100, -height()/2+20),
                width: (1-boss.hp()/bossHealth)*440,
                height: 16,
                color: rgb(255, 0, 0),
            });
            drawRect({
                pos: camPos().add(-width()/2+100-1, -height()/2+20-1),
                width: 442,
                height: 18,
                fill: false,
                outline: {width: 1},
            });
        }
    })

    add([
        pos(boss.pos.x+9, boss.pos.y+125),
        sprite('bottle', {anim: 'half'}),
        z(-1)

    ])
    add([
        pos(boss.pos.x+59, boss.pos.y+130),
        sprite('bottle', {anim: 'full'}),
        z(-1)
    ])


    const cnc = player.onUpdate(() => {
        if (bossDisappeared) {
            // doggy
            const doggy = add([
                pos(boss.pos),
                sprite('dog2', {flipX: true}),
                area(),
                body({solid: false}),
                move(LEFT, 100)
            ])
            doggy.jump()
            // kitty
            const kitty = add([
                pos(boss.pos),
                sprite('kitten', {anim: 'move'}),
                area(),
                body({solid: false}),
                move(RIGHT, 100)
            ])
            kitty.jump()
            // key
            addKey('red', boss.pos.x, bossTilePos.y+H-40)
            cnc()
        }
    })


    // let cooldown = 2;
    // boss.onUpdate(() => {
    //     if (bossKilled) {
    //         addKey('red', boss.pos.x+boss.width/2, y+H-40)
    //         // add([
    //         //     pos(boss.pos),
    //         //     sprite('puppy', {anim: 'move'}),
    //         // ])
    //         destroy(boss);
    //         return;
    //     }
    //
    //     // boss attacks
    //
    //     // if (cooldown > 0) {
    //     //     cooldown -= dt()
    //     // } else {
    //     //     const fire = add([
    //     //         pos(boss.pos),
    //     //         sprite('fire', {anim: 'fire'}),
    //     //
    //     //     ])
    //     // }
    // })

}
