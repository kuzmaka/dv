export default () => {
    loadRoot('sprites/lab/')
    loadSprite('lab0', 'lab0.png')
    loadSprite('lab1', 'lab1.png')
    loadSprite('lab2-exit', 'lab2-exit.png')
    loadSprite('cage', 'cage.png')
    loadSprite('heart', 'heart.png', {
        sliceX: 6,
        sliceY: 2,
        anims: {
            on: {
                from: 6,
                to: 11,
                loop: true,
                speed: 3
            },
            off: {
                from: 0,
                to: 5,
                loop: true,
                speed: 3
            }
        }
    })

    loadRoot('sprites/office/')
    loadSprite('office1-1', 'office1-1.png')
    loadSprite('office1-2', 'office1-2.png')
    loadSprite('office1-3', 'office1-3.png')
    loadSprite('office2-1', 'office1-1.png')
    loadSprite('office2-2', 'office2-2.png')
    loadSprite('office2-3', 'office2-3.png')

    loadRoot('../../')
    loadSprite('doggy', 'sprites/doggy.png', {
        sliceX: 1,
        sliceY: 2,
        anims: {
            sit: {
                from: 0,
                to: 0,
            },
            stay: {
                from: 1,
                to: 1,
            },
        }
    })

    loadSprite('dog', 'sprites/greyhound.png', {
        sliceX: 1,
        sliceY: 9,
        anims: {
            idle: {
                from: 0,
                to: 0,
            },
            lay: {
                from: 1,
                to: 1,
            },
            run: {
                from: 2,
                to: 7,
                speed: 12,
                loop: true
            },
            jump: {
                from: 6,
                to: 6,
            },
            fall: {
                from: 7,
                to: 7,
            },
            dead: {
                from: 8,
                to: 8,
            }
        }
    })
}
