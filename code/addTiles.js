import {H, W} from "./init";

export function addTiles(tiles) {

    tiles.forEach((Tiles, i) => {
        Tiles.forEach((tile, j) => {
            add([
                pos(j * W, i * H),
                sprite(tile)
            ])
            add([
                pos(j * W, i * H),
                text(i)
            ])
        if (tile === 'lab0') {
            // bed
            add([
                pos(345, 291),
                area({
                    width: 88,
                    height: 10
                }),
                solid()
            ])
        }
        if (tile === 'lab1') {
            // some parkour stuff :)
            for (let k=0; k < 5; k++) {
                add([
                    pos(randi(j * W, (j + 1) * W), randi(80, H - 80)),
                    rect(100, 10),
                    color(BLACK),
                    opacity(0.5),
                    area(),
                    solid(),
                    z(100)
                ])
            }
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
