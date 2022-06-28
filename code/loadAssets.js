export default () => {
    loadRoot('sprites/')
    loadSprite('sky-night', 'sky-night.png', {
        sliceX: 1,
        sliceY: 3,
        anims: {
            blink: {
                from: 0,
                to: 2,
                loop: true,
                speed: 0.5
            }
        }
    })
    loadSprite('light', 'light.png')
    loadSprite('supepper', 'supepper.png')
    loadSprite('gas', 'gas.png')
    loadSprite('grille', 'grille.png')

    loadRoot('sprites/lab/')
    loadSprite('lab0', 'lab0.png')
    loadSprite('lamp', 'lamp.png')
    loadSprite('lab1', 'lab1.png')
    loadSprite('lab2-exit', 'lab2-exit.png')
    loadSprite('lab-dock', 'lab-dock.png', {
        sliceX: 1,
        sliceY: 2,
        anims: {
            close: {
                from: 0,
                to: 0,
            },
            open: {
                from: 1,
                to: 1
            }
        }
    })
    loadSprite('dock1', 'dock1.png')
    loadSprite('dock2', 'dock2.png')
    loadSprite('ship0', 'ship0.png')
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
    loadSprite('teleport', 'teleport2.png')
    loadSprite('lattice', 'lattice.png')
    loadSprite('arrow-1', 'arrow-1.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 3,
                speed: 5,
                loop: true
            }
        }
    })
    loadSprite('arrow-2', 'arrow-2.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 3,
                speed: 5,
                loop: true
            }
        }
    })
    loadSprite('shelf-edge', 'shelf-edge.png')
    loadSprite('shelf-books', 'shelf-books.png')
    loadSprite('shelf-middle', 'shelf-middle.png')
    loadSprite('office-rat', 'office-rat.png', {
        sliceX: 5,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 0
            },
            run: {
                from: 1,
                to: 4,
                speed: 10,
                loop: true
            }
        }
    })

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
    loadSprite('dog2', 'sprites/dog2.png', {
        sliceX: 1,
        sliceY: 2,
        anims: {
            tongue: {
                from: 0,
                to: 1,
                speed: 2,
                loop: true
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
