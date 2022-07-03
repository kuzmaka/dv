import {W, H} from './init'

export default () => {

    add([
        pos(W/2, 20),
        origin('top'),
        text('Developed by', {size: 12})
    ])
    add([
        pos(W/2, 40),
        origin('topright'),
        text('Kuzma', {size: 16})
    ])
    add([
        pos(W/2, 40),
        origin('topleft'),
        text(' Kudim', {size: 16})
    ])
    add([
        pos(W/2, 60),
        origin('topright'),
        text('Eugene', {size: 16})
    ])
    add([
        pos(W/2, 60),
        origin('topleft'),
        text(' Khromov', {size: 16})
    ])
    add([
        pos(W/2, 100),
        origin('top'),
        text('Special thanks to', {size: 12})
    ])
    add([
        pos(W/2, 120),
        origin('topright'),
        text('Yaroslava', {size: 16})
    ])
    add([
        pos(W/2, 120),
        origin('topleft'),
        text(' Kudim', {size: 16})
    ])
    add([
        pos(W/2, 140),
        origin('topright'),
        text('Tikhon', {size: 16})
    ])
    add([
        pos(W/2, 140),
        origin('topleft'),
        text(' Kudim', {size: 16})
    ])
    add([
        pos(W/2, 160),
        origin('topright'),
        text('Atlant', {size: 16})
    ])
    add([
        pos(W/2, 160),
        origin('topleft'),
        text(' The Greyhound', {size: 16})
    ])
    add([
        pos(W/2, 180),
        origin('topright'),
        text('Skif', {size: 16})
    ])
    add([
        pos(W/2, 180),
        origin('topleft'),
        text(' The Cat', {size: 16})
    ])




    add([
        pos(W/2, 250),
        origin('center'),
        sprite('light-white'),
        opacity(0.3),
        z(0),
    ])
    add([
        pos(W/2, 250),
        origin('center'),
        sprite("dog", {
            anim: 'run',
        }),
        z(1)
    ])

    add([
        pos(W/2, 300),
        origin('top'),
        text('Music and sounds by', {size: 12})
    ])
    add([
        pos(W/2 - 5, 320),
        origin('topright'),
        text('opengameart.org/users/bart', {size: 10})
    ])
    add([
        pos(W/2 + 5, 320),
        origin('topleft'),
        text('opengameart.org/users/haeldb', {size: 10})
    ])
    add([
        pos(W/2 - 5, 340),
        origin('topright'),
        text('opengameart.org/users/matthew-pablo', {size: 10})
    ])
}