import {addPlayer, addTiles, setupCamera} from "./createLevel";

export default () => {
    const tiles = [
        [{name: 'office2-1'}, {name: 'office2-2', onAdded: (tile, i, l) => {
                const [x, y] = [tile.pos.x, tile.pos.y];
                add([
                    pos(x + 220, y + 235),
                    area({
                        width: 190,
                        height: 120
                    }),
                    'camscale'
                ])
            }}, {name: 'office2-3'}],
        [{name: 'office1-1'}, {name: 'office1-2'}, {name: 'office1-3'}]
    ]
    addTiles(tiles, {
        floor: 10
    })

    const player = addPlayer(100, 180)

    setupCamera(player)

    const scaleobj = get('camscale')[0]
    player.onUpdate(() => {
        if(player.isColliding(scaleobj)) {
            camScale(camScale().lerp(vec2(0.5), dt()*3))
        } else {
            camScale(camScale().lerp(vec2(1), dt()*3))
        }
    })
}
