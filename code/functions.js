import {H, W} from "./init";
import {ratBehaviour} from "./components";

export function goto(scene, args) {
    const darkScreen = add([
        pos(camPos()),
        origin('center'),
        rect(3*W, 3*H),
        opacity(0),
        color(BLACK),
        z(1000)
    ])
    let timer = 0;
    let dur = 0.5;
    darkScreen.onUpdate(() => {
        if (timer < dur) {
            timer += dt();
            darkScreen.opacity = map(timer, 0, dur, 0, 1);
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

export function addLift(tilePos, player, liftwall = null) {

    if (liftwall) {
        add([
            pos(tilePos),
            sprite(liftwall)
        ])
        add([
            pos(tilePos.add(0, H)),
            sprite(liftwall)
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
            width: 8,
            height: lift.height - 8
        }),
        solid()
    ])

    const door = add([
        pos(p.x, p.y - 8),
        origin('botright'),
        area({
            width: 8,
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

    let state = 'top';
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

            lift.moveTo(p.add(0, (state === 'down' ? H : 0)), 100)
            wall.pos = vec2(lift.pos.x - lift.width, lift.pos.y - 8)
            door.pos = vec2(lift.pos.x, lift.pos.y - 8)
            floor.pos = vec2(lift.pos)
            if (lift.pos.y === p.y + (state === 'down' ? H : 0)) {
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

export function addContainer(x, y) {
    add([
        pos(x, y),
        sprite('container'),
        area(),
        solid(),
        body()
    ])
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
            'enemy'
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
