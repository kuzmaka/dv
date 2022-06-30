export function jitter() {
    let p;
    let moveOut = true;
    let enabled = true;
    return {
        id: 'jitter',
        require: ['pos', 'outview'],
        add() {
            p = this.pos.clone();
        },
        update() {
            if (!enabled || this.isOutOfView()) {
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
        stopJitter() {
            enabled = false
        }

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

export function ratBehaviour() {
    return {
        speed: 100,
        cooldown: 3,
        target: get('player')[0],
        flip: false,
        edges: [],
        update() {
            this.target = get('player')[0]
            if(this.state === 'attack') return
            if (this.pos.dist(this.target.pos.add(48, 48)) <= 80 && Math.abs(this.pos.y - this.target.pos.y) <= 60) {
                this.enterState('attack')
            }
        },
        load() {
            wait(0.5, () => {
                this.target = get('player')[0]
                this.edges = get('edge')
            })
            this.moveBy(0, 13)
            this.enterState('idle')
            this.onStateEnter('attack', () => {
                this.play('atkprep')
                wait(0.5, () => {
                    this.play('attack')
                    let check = add([
                        pos(this.pos.sub(75*this.flip, 0)),
                        area({
                            width: 75,
                            height: 20
                        })
                    ])
                    if (check.isColliding(this.target)) {
                        this.target.die()
                    }
                    destroy(check)
                    wait(0.1, () => {
                        this.enterState('idle')
                    })
                })
            })
            this.onStateEnter('run', () => {
                this.play('run')
            })
            this.onStateUpdate('run', () => {
                if(Math.abs(this.pos.x - this.target.pos.x) <= 5) {
                    this.enterState('idle')
                    return
                }
                let t = this.pos.x - this.target.pos.x
                this.flipX(this.flip = t > 0)
                let o = false
                let e
                this.edges.forEach((edge) => {
                    if(o) return
                    if(this.isColliding(edge)) {
                        o = true
                        e = edge
                    }
                })
                if(o) {
                    let check = add([
                        pos(this.pos.x + 30 * (this.flip ? -0.5 : 1), this.pos.y + 40),
                        area({
                            width: 20,
                            height: 30
                        }),
                        solid()
                    ])
                    let tt = check.pos.clone()
                    check.moveBy(0, 0)
                    tt = tt.dist(check.pos)
                    destroy(check)
                    if(tt <= 0.5) {
                        this.enterState('idle')
                        return
                    }
                }
                this.move(this.speed * (t > 0 ? -1 : 1), 0)
            })
            this.onStateEnter('idle', () => {
                this.play('idle')
            })
            this.onStateUpdate('idle', () => {
                let t = this.pos.x - this.target.pos.x
                this.flipX(this.flip = t > 0)
                let o = false
                let e
                this.edges.forEach((edge) => {
                    if(o) return
                    if(this.isColliding(edge)) {
                        o = true
                        e = edge
                    }
                })
                if(o) {
                    let check = add([
                        pos(this.pos.x + 30 * (this.flip ? -0.5 : 1), this.pos.y + 40),
                        area({
                            width: 20,
                            height: 30
                        }),
                        solid()
                    ])
                    let tt = check.pos.clone()
                    check.moveBy(0, 0)
                    tt = tt.dist(check.pos)
                    destroy(check)
                    if(tt <= 0.5) {
                        return
                    }
                }
                if(Math.abs(this.pos.x - this.target.pos.x) > 5) this.enterState('run')
            })
        }
    }
}