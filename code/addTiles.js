import {H, W} from "./init";

export function addTiles(tiles) {

    tiles.forEach((Tiles, i) => {
        Tiles.forEach((tile, j) => {
            const name = typeof tile === 'string' ? tile : tile.name;
            const t = add([
                pos(j * W, i * H),
                sprite(name)
            ])
            add([
                pos(j * W, i * H),
                text(i + '-' + j, {size: 24})
            ])
            if (typeof tile === 'object' && tile.onAdded) {
                tile.onAdded(t, i, j)
            }
        })
        // floor
        add([
            pos(0, (i + 1) * H - 8),
            rect(1000*W, 100),
            opacity(0),
            area(),
            solid()
        ])
    })

}
