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

export function swing() {
    let p;
    return {
        id: 'swing',
        require: ['pos'],
        add() {
            p = this.pos.clone()
        },
        update() {
            this.moveTo(p.add(0, 10*Math.sin(time()*5)))
        }
    }
}

// added startOpacity
export function myLifespan(time, opt = {}) {
    if (time == null) {
        throw new Error("lifespan() requires time");
    }
    let timer = 0;
    const fade = opt.fade ?? 0;
    const startFade = Math.max((time - fade), 0);
    const startOpacity = opt.opacity ?? 1;
    return {
        id: "myLifespan",
        update() {
            timer += dt();
            if (timer >= startFade) {
                this.opacity = map(timer, startFade, time, startOpacity, 0);
            }
            if (timer >= time) {
                this.destroy();
            }
        },
    };
}

export function fade(time, opt = {}) {
    if (time == null) {
        throw new Error("fade() requires time");
    }
    let timer = 0;
    return {
        id: "fade",
        update() {
            if (timer < time) {
                timer += dt();
                this.opacity = map(timer, 0, time, typeof opt.from === 'undefined' ? 0 : opt.from, typeof opt.to === 'undefined' ? 1 : opt.to);
            }
        },
    };
}

export function checkpoint(playerPos) {
    return {
        id: 'checkpoint',
        require: ['area'],
        playerPos: playerPos.clone()
    }
}
