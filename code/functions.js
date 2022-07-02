import {gameState, H, W} from "./init";
import {myLifespan, ratBehaviour, swing} from "./components";

export function goto(scene, duration, args) {
    const darkScreen = add([
        pos(camPos()),
        origin('center'),
        rect(duration*3*W, duration*3*H),
        opacity(0),
        color(BLACK),
        z(1000)
    ])
    let timer = 0;
    darkScreen.onUpdate(() => {
        if (timer < duration) {
            timer += dt();
            darkScreen.opacity = map(timer, 0, duration, 0, 1);
        } else {
            go(scene, args)
        }
    })
}

export function shakeObj(obj, time, strength = 4) {
    let p = obj.pos.clone();
    let moveOut = true;
    let timer = 0;
    const cancel = obj.onUpdate(() => {
        timer += dt()
        if (timer < time) {
            if (moveOut) {
                obj.move(choose([LEFT, RIGHT, UP, DOWN]).scale(20))
                if (obj.pos.dist(p) > strength) {
                    moveOut = false
                }
            } else {
                obj.moveTo(p.x, p.y, 20)
                if (obj.pos.dist(p) < 1) {
                    moveOut = true
                }
            }
        } else {
            obj.moveTo(p)
            cancel()
        }
    })
}

export function addLift(tilePos, player, goesUp, opts = {}) {

    if (opts.liftwall) {
        add([
            pos(tilePos),
            sprite(opts.liftwall)
        ])
        add([
            pos(tilePos.add(0, H)),
            sprite(opts.liftwall)
        ])
    }

    const p = tilePos.add(0, H)

    const lift = add([
        pos(p),
        origin('botright'),
        sprite('lift'),
        area({
            offset: vec2(-70, 0),
            width: 150
        }),
    ])

    const wall = add([
        pos(p.x - lift.width, p.y - 8),
        origin('botleft'),
        area({
            width: 36,
            height: lift.height - 8
        }),
        solid()
    ])

    const door = add([
        pos(p.x, p.y - 8),
        origin('botright'),
        area({
            width: 30,
            height: lift.height - 16
        }),
    ])
    door.hidden = true

    const floor = add([
        pos(p),
        origin('botright'),
        area({
            width: 199,
            height: 8
        }),
        solid()
    ])

    let state = goesUp ? 'bottom' : 'top';
    let fromY;

    lift.onCollide('player', () => {
        if (state === 'top') {
            state = 'down';
            fromY = lift.pos.y;
            door.solid = true
            door.hidden = false
        }
        if (state === 'bottom') {
            state = 'up'
            fromY = lift.pos.y;
            door.solid = true
            door.hidden = false
        }
    })

    lift.onUpdate(() => {
        lift.play(state)
        if (state === 'down' || state === 'up') {
            const inLift = player.curPlatform() === floor;
            const dy = goesUp ? (state === 'down' ? 0 : -H) : (state === 'down' ? H : 0)
            lift.moveTo(p.add(0, dy), 100)
            wall.pos = vec2(lift.pos.x - lift.width, lift.pos.y - 8)
            door.pos = vec2(lift.pos.x, lift.pos.y - 8)
            floor.pos = vec2(lift.pos)
            if (lift.pos.y === p.y + dy) {
                state = state === 'down' ? 'bottom' : 'top';
                door.solid = false
                door.hidden = true
            }

            if (inLift) {
                player.moveTo(player.pos.x, lift.pos.y - 8 - player.area.offset.y - player.area.height)
            }
        }
    })

}

export function addContainer(x, y, _solid = false) {
    const t = add([
        pos(x, y),
        sprite('container'),
        area(),
        'container'
    ])
    t.solid = _solid
    return t
}

export function gasSystem(gases = [], cd) {
    add([
        {
            cooldown: 0,
            gases: [],
            update() {
                if(this.cooldown > 0) this.cooldown -= dt()
                if(this.cooldown <= 0) {
                    this.gases.forEach((gas) => {destroy(gas)})
                    gases.forEach((gas) => {
                        this.gases.push(addGasLattice(gas[0], gas[1]))
                    })
                    this.cooldown = cd
                }
            }
        }
    ])
}

export function addGasLattice(p, opt = {}) {
    return add([
        sprite(opt.rotate ? 'lattice-y' : 'lattice-x', {flipY: !opt.flip, flipX: opt.flip}),
        pos(p),
        area(),
        outview(),
        {
            cooldown: opt.scd !== undefined ? opt.scd : opt.cd !== undefined ? opt.cd : 3,
            attack: 0,
            microcd: 3,
            gasSpeed: 150,
            update() {
                if(this.attack > 0) this.attack -= dt()
                if(this.microcd > 0) this.microcd -= 1
                if(this.attack <= 0 && this.cooldown > 0) this.cooldown -= dt()
                else if(this.cooldown <= 0) {
                    this.cooldown = opt.cd !== undefined ? opt.cd : 1.5
                    this.attack = opt.atkTime !== undefined ? opt.atkTime : 1.5
                }
                if(this.cooldown <= 0.6) this.color = rgb(map(this.cooldown, 0, 0.6, 255, 0))
                else this.color = undefined
                if(!this.isOutOfView())
                    if(this.attack > 0 && this.microcd <= 0) {
                        add([
                            sprite('gas'),
                            pos(this.pos.sub(opt.rotate ? (opt.flip ? 32 : -4) : 0, opt.rotate ? 0 : opt.flip ? -4 : 32)),
                            area(),
                            move(-90 * (opt.flip ? -1 : 1) + 90 * (opt.rotate ? 1 : 0) + rand(-10, 10), this.gasSpeed),
                            lifespan(1, {fade: 0.5}),
                            {
                                load() {
                                    this.onCollide('player', (p) => {
                                        p.die()
                                    })
                                }
                            }
                        ])
                        this.microcd = 3
                    }
            }
        }
    ])
}

export function addObjects(map, opt) {
    addLevel(map, {
        pos: opt.pos,
        width: opt.width ? opt.width : 32,
        height: opt.height ? opt.height : 32,
        "!": () => [
            sprite('shelf-edge'),
            area({
                offset: vec2(0, 28),
                height: 4
            }),
            solid(),
            'edge'
        ],
        "=": () => [
            sprite('shelf-middle'),
            area({
                offset: vec2(0, 28),
                height: 4
            }),
            solid()
        ],
        "b": () => [
            sprite('shelf-books'),
            area({
                offset: vec2(0, 28),
                height: 4
            }),
            solid()
        ],
        "r": () => [
            sprite('office-rat', {anim: 'run'}),
            area({
                width: 54,
                height: 55,
                offset: vec2(0, 20)
            }),
            ratBehaviour(),
            origin('center'),
            state('idle', ['idle', 'run', 'attack']),
            z(15),
            'enemy',
            'deflatable'
        ],
        "t": () => [
            sprite('table', {frame: randi(2)}),
            area({
                height: 2,
                offset: vec2(0, 22)
            }),
            solid()
        ]
    })
}

//dont want refactor addGasArea()
export function timedGas(x, y, r, time = 9999) {
    const gasArea = add([
        pos(x, y),
        origin('center'),
        area({width: 2*r, height: 2*r}),
        outview(),
        {
            time: time,
            target: get('player')[0],
            update() {
                this.time -= dt()
                if(this.time <= 0) destroy(this)
            },
        }
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
        if (gasArea.isOutOfView()) {
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
        if (gasArea.target.isColliding(gasCircle)) {
            gasArea.target.die()
        }
    })
}

export function addKey(color, x, y) {
    const key = add([
        pos(x, y),
        sprite(color + '-key'),
        origin('center'),
        area(),
        swing(),
    ])
    key.onCollide('player', () => {
        play('score')
        key.destroy()
        if (color === 'blue') {
            gameState.hasBlueKey = true
        }
        if (color === 'red') {
            gameState.hasRedKey = true
        }
    })
}

export function addSuperWoofPepper(x, y) {

    const supepper = add([
        pos(x, y),
        sprite('supepper'),
        origin('center'),
        area(),
        swing()
    ])
    supepper.onCollide('player', (player) => {
        play('score')
        supepper.destroy()
        gameState.canSuperWoof = true
        player.woof()
    })
}

export function addSuperFirePepper(x, y) {

    const supepper = add([
        pos(x, y),
        sprite('supepper'),
        origin('center'),
        area(),
        swing()
    ])
    supepper.onCollide('player', (player) => {
        play('score')
        supepper.destroy()
        gameState.canFire = true
        player.fire()
    })
}