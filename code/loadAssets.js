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
    loadSprite('light-white', 'light-white.png')
    loadSprite('supepper', 'supepper.png')
    loadSprite('gas', 'gas.png')
    loadSprite('grille', 'grille.png')
    loadSprite('hint-q', 'hint-q.png')
    loadSprite('hint-e', 'hint-e.png')
    loadSprite('blue-key', 'blue-key.png')
    loadSprite('red-key', 'red-key.png')
    loadSprite('liftwall', 'liftwall.png')
    loadSprite('lift', 'lift.png', {
        sliceX: 1,
        sliceY: 3,
        anims: {
            top: {
                from: 0,
                to: 0,
            },
            bottom: {
                from: 0,
                to: 0,
            },
            down: {
                from: 1,
                to: 1
            },
            up: {
                from: 2,
                to: 2
            }
        }
    })
    loadSprite('empty', 'empty.png')
    loadSprite('wave', 'wave.png')
    loadSprite('fire', 'fire.png', {
        sliceX: 1,
        sliceY: 4,
        anims: {
            fire: {
                from: 0,
                to: 3,
                speed: 16,
            },
        }
    })
    loadSprite('box', 'box.png')
    loadSprite('container', 'container-logo-night.png')
    loadSprite('snow', 'snow.png', {
        sliceX: 1,
        sliceY: 5,
        anims: {
            letitsnow: {
                from: 0,
                to: 4,
                loop: true,
                speed: 12
            },
        }
    })

    loadRoot('sprites/lab/')
    loadSprite('sky-violet', 'sky-violet.png')
    loadSprite('lab0', 'lab0.png')
    loadSprite('lamp', 'lamp.png')
    loadSprite('xray', 'xray.png')
    loadSprite('lab1', 'lab1.png')
    loadSprite('lab1-window', 'lab1-window.png')
    loadSprite('cabinet-bottles', 'cabinet-bottles.png')
    loadSprite('cabinet', 'cabinet.png')
    loadSprite('lab2-exit', 'lab2-exit.png')
    loadSprite('lab-final', 'lab-final.png')
    loadSprite('lab-boss', 'boss2.png', {
        sliceX: 1,
        sliceY: 4,
        anims: {
            move: {
                from: 0,
                to: 3,
                loop: true,
                speed: 1
            },
        }
    })
    loadSprite('lab-dock', 'lab-dock.png', {
        sliceX: 1,
        sliceY: 3,
        anims: {
            close: {
                from: 0,
                to: 0,
            },
            right: {
                from: 1,
                to: 1
            },
            left: {
                from: 2,
                to: 2
            }
        }
    })
    loadSprite('dock1', 'dock1.png')
    loadSprite('dock2', 'dock2.png')
    loadSprite('ship0', 'ship0.png')
    loadSprite('seagull', 'seagull.png')
    loadSprite('cage', 'cage2.png')
    loadSprite('cage-open', 'cage-open.png')
    loadSprite('lift-sign', 'lift-sign.png')
    loadSprite('blueprint', 'blueprint.png')
    loadSprite('doorwall', 'doorwall.png')
    loadSprite('door', 'door.png', {
        sliceX: 1,
        sliceY: 3,
        anims: {
            close: {
                from: 0,
                to: 0,
            },
            left: {
                from: 1,
                to: 1
            },
            right: {
                from: 2,
                to: 2
            }
        }
    })
    loadSprite('bluelock', 'bluelock.png')
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

    loadRoot('sprites/city/')
    loadSprite('ship-mid', 'ship-mid.png')
    loadSprite('ship-mid-end-back', 'ship-mid-end-back.png')
    loadSprite('ship-mid-end-front', 'ship-mid-end-front.png')
    loadSprite('ship-end-back', 'ship-end-back.png')
    loadSprite('ship-end-front', 'ship-end-front.png')
    loadSprite('street0', 'street0.png')
    loadSprite('street-office', 'street-office.png')

    loadRoot('sprites/office/')
    loadSprite('office1-1', 'office1-1.png')
    loadSprite('office1-2', 'office1-2.png')
    loadSprite('office1-3', 'office1-3.png')
    loadSprite('office2-1', 'office2-1.png')
    loadSprite('office2-2', 'office2-2.png')
    loadSprite('office2-3', 'office2-3.png')
    loadSprite('office3-1', 'office3-1.png')
    loadSprite('office3-2', 'office3-2.png')
    loadSprite('office3-3', 'office2-3.png')
    loadSprite('office4-1', 'office4-1.png')
    loadSprite('office4-2', 'office4-2.png')
    loadSprite('office4-3', 'office4-3.png')
    loadSprite('office5-1', 'office5-1.png', {
        sliceX: 0,
        sliceY: 2,
        anims: {
            light: {
                from: 0,
                to: 1,
                speed: 1,
                loop: true
            }
        }
    })
    loadSprite('office5-2', 'office5-2.png', {
        sliceX: 0,
        sliceY: 2,
        anims: {
            light: {
                from: 0,
                to: 1,
                speed: 1,
                loop: true
            }
        }
    })
    loadSprite('office5-3', 'office5-3.png', {
        sliceX: 0,
        sliceY: 2,
        anims: {
            light: {
                from: 0,
                to: 1,
                speed: 1,
                loop: true
            }
        }
    })
    loadSprite('teleport', 'teleport2.png')
    loadSprite('lattice-x', 'lattice-x.png')
    loadSprite('lattice-y', 'lattice-y.png')
    loadSprite('table', 'table(offset22).png', {
        sliceX: 2,
        sliceY: 1,
        anims: {
            t1: {
                from: 0,
                to: 0
            },
            t2: {
                from: 1,
                to: 1
            }
        }
    })
    loadSprite('arrow-1', 'arrow-1.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 7,
                speed: 8,
                loop: true
            }
        }
    })
    loadSprite('arrow-2', 'arrow-2-1.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 7,
                speed: 8,
                loop: true
            }
        }
    })
    loadSprite('arrow-3', 'arrow-3-1.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 7,
                speed: 8,
                loop: true
            }
        }
    })
    loadSprite('arrow-4', 'arrow-4.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 7,
                speed: 8,
                loop: true
            }
        }
    })
    loadSprite('arrow-5', 'arrow-5.png', {
        sliceX: 8,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 7,
                speed: 8,
                loop: true
            }
        }
    })
    loadSprite('shelf-edge', 'shelf-edge.png')
    loadSprite('shelf-books', 'shelf-books.png')
    loadSprite('shelf-middle', 'shelf-middle.png')
    loadSprite('office-rat', 'office-rat.png', {
        sliceX: 7,
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
            },
            atkprep: {
                from: 5,
                to: 5
            },
            attack: {
                from: 6,
                to: 6
            }
        }
    })
    loadSprite('office-boss', 'office-boss.png', {
        sliceX: 6,
        sliceY: 4,
        anims: {
            idle: {
                from: 0,
                to: 0
            },
            atkprep: {
                from: 1,
                to: 1
            },
            attack: {
                from: 2,
                to: 4,
                speed: 20
            },
            throw: {
                from: 5,
                to: 17,
                speed: 10
            },
            run: {
                from: 18,
                to: 21,
                speed: 4,
                loop: true
            }
        }
    })
    loadSprite('throwed-pepper', 'throwed-pepper.png', {
        sliceX: 4,
        sliceY: 1,
        anims: {
            rotating: {
                from: 0,
                to: 3,
                speed: 4,
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
    loadSprite('dog3', 'sprites/dog3.png')

    loadSprite('dog', 'sprites/grey.png', {
        sliceX: 1,
        sliceY: 13,
        anims: {
            idle: {
                from: 0,
                to: 1,
                speed: 1,
                loop: true
            },
            lay: {
                from: 6,
                to: 6,
            },
            crawl: {
                from: 7,
                to: 8,
                speed: 4,
                loop: true
            },
            run: {
                from: 2,
                to: 5,
                speed: 8,
                loop: true
            },
            jump: {
                from: 10,
                to: 10,
            },
            fall: {
                from: 11,
                to: 12,
                speed: 12,
                loop: true
            },
            dead: {
                from: 9,
                to: 9,
            }
        }
    })
}
