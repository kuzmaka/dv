import {W, H} from './init'

export default () => {
    add([
        pos(0),
        sprite('lab0')
    ])

    add([
        pos(center().add(30, 71)),
        sprite('dog', {anim: 'dead', flipX: true}),
    ])

    wakeUp()
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
    onUpdate(() => {
        if (cover2.opacity > 0) {
            cover2.opacity = Math.max(0, cover2.opacity - 0.3*dt())
        } else {
            if (cover1.opacity > 0) {
                cover1.opacity = Math.max(0, cover1.opacity - 0.3 * dt())
            }
        }
    })
}