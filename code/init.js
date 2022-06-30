import kaboom from "kaboom"

export const DEBUG_SHOW_TILE_INDEX = 1
export const DEBUG_NO_ALARM = 1
export const DEBUG_NO_SLEEP = 1
export const DEBUG_NO_SOUNDS = 1

export const W = 640
export const H = 360

export default () => {
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

