import kaboom from "kaboom"

export const DEBUG_SHOW_TILE_INDEX = 0
export const DEBUG_NO_ALARM = 0
export const DEBUG_NO_SLEEP = 0
export const DEBUG_CAN_SUPER_WOOF = 0
export const DEBUG_CAN_FIRE = 0
export const DEBUG_HAS_BLUE_KEY = 0
export const DEBUG_HAS_RED_KEY = 0

export let gameState = {
    canSuperWoof: !!DEBUG_CAN_SUPER_WOOF,
    canFire: !!DEBUG_CAN_FIRE,
    hasBlueKey: !!DEBUG_HAS_BLUE_KEY,
    hasRedKey: !!DEBUG_HAS_RED_KEY,
    freeDoggiesCount: 0
}

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
