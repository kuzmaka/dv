import kaboom from "kaboom"

export default () => {
    const W = 640
    const H = 360
    const canvasElem = document.getElementById('canvas')
    const elem = canvasElem.parentElement
    const wScale = Math.floor(elem.clientWidth / W)
    const hScale = Math.floor(elem.clientHeight / H)
    kaboom({
        width: W,
        height: H,
        scale: Math.max(1, Math.min(wScale, hScale)),
        crisp: true,
        canvas: canvasElem,
        background: [0, 0, 0],
    })
    canvas.focus()
}