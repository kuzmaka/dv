export default () => {
    const startButton = add([
        pos(center()),
        origin('center'),
        text('START'),
        area()
    ])

    startButton.onUpdate(() => {
        if (startButton.isHovering()) {
            startButton.color = RED
            cursor('pointer')
        } else {
            startButton.color = WHITE
            cursor('default')
        }
    })

    startButton.onClick(() => go('intro'))
}