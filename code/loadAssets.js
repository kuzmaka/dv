export default () => {
    loadSprite('lab0', 'sprites/lab0.png')

    loadSprite('dog', 'sprites/greyhound.png', {
        sliceX: 1,
        sliceY: 9,
        anims: {
            idle: {
                from: 0,
                to: 0,
                speed: 1,
                loop: true
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
                to: 8
            }
        }
    })
}