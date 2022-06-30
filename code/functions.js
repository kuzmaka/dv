import {H, W} from "./init";

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

export function addLift(tilePos, player) {

    const p = tilePos.add(0, H)

    const lift = add([
        pos(p),
        origin('botright'),
        sprite('lift'),
        area({
            offset: vec2(-50, 0),
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
        }
        if (state === 'bottom') {
            state = 'up'
            fromY = lift.pos.y;
        }
    })

    lift.onUpdate(() => {
        lift.play(state)
        if (state === 'down' || state === 'up') {
            const inLift = player.curPlatform() === floor;

            lift.moveTo(p.add(0, (state === 'down' ? H : 0)), 100)
            wall.pos = vec2(lift.pos.x - lift.width, lift.pos.y - 8)
            floor.pos = vec2(lift.pos)
            if (lift.pos.y === p.y + (state === 'down' ? H : 0)) {
                state = state === 'down' ? 'bottom' : 'top';
            }

            if (inLift) {
                player.moveTo(player.pos.x, lift.pos.y - 8 - player.area.offset.y - player.area.height)
            }
        }
    })

}