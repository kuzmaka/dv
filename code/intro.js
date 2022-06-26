export default () => {
    add([
        pos(0),
        sprite('lab0')
    ])

    add([
        pos(center().add(30, 71)),
        sprite('dog', {anim: 'dead', flipX: true}),
    ])
}