export default () => {
    add([
        pos(0),
        sprite('lab0')
    ])

    add([
        pos(center().add(50, 56)),
        sprite('dog', {anim: 'dead'}),
    ])
}