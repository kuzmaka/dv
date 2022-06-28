export function jitter() {
    let p;
    let moveOut = true;
    return {
        id: 'jitter',
        require: ['pos', 'outview'],
        add() {
            p = this.pos.clone();
        },
        update() {
            if (this.isOutOfView()) {
                return
            }
            if (moveOut) {
                this.move(choose([LEFT, RIGHT, UP, DOWN]).scale(20))
                if (this.pos.dist(p) > 4) {
                    moveOut = false
                }
            } else {
                this.moveTo(p.x, p.y, 20)
                if (this.pos.dist(p) < 1) {
                    moveOut = true
                }
            }
        },
    }
}

