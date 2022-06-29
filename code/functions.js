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
