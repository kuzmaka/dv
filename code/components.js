import {timedGas} from "./functions";

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

export function wiggle(dur = 1) {
    let timer = 0;
    let done = false;
    return {
        id: 'swing',
        require: ['scale'],
        update() {
            if (done) return;
            if (timer < dur) {
                timer += dt()
                this.scaleTo(1.5)
                this.angle = 10*Math.sin(time()*40)
            } else {
                this.scaleTo(1)
                this.angle = 0;
                done = true;
            }
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
            if(this.cooldown > 0) this.cooldown -= dt()
            if(this.state === 'attack') return
            if(this.pos.dist(this.target.pos.add(48, 48)) <= 80 && Math.abs(this.pos.y - this.target.pos.y) <= 60 && this.cooldown <= 0) {
                this.enterState('attack')
                this.cooldown = 3
            }
        },
        load() {
            wait(0.5, () => {
                this.target = get('player')[0]
                this.edges = get('edge')
            })
            this.moveBy(0, 13)
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
                let t = this.target.pos.x - this.pos.x + 20
                if(Math.abs(t) <= 5 || this.pos.dist(this.target.pos) > 500) {
                    this.enterState('idle')
                    return
                }
                this.flipX(this.flip = t < 0)
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
                        pos(this.pos.x + 30 * (this.flip ? -0.6 : 1), this.pos.y + 40),
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
                this.move(this.speed * (t > 0 ? 1 : -1), 0)
            })
            this.onStateEnter('idle', () => {
                this.play('idle')
            })
            this.onStateUpdate('idle', () => {
                if(this.pos.dist(this.target.pos) > 500) return
                let t = this.target.pos.x - this.pos.x + 20
                this.flipX(this.flip = t < 0)
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
                        pos(this.pos.x + 30 * (this.flip ? -0.6 : 1), this.pos.y + 40),
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
                if(Math.abs(t) > 5) this.enterState('run')
            })
            this.enterState('idle')
        }
    }
}

export function officeBossBehaviour() {
    return {
        target: undefined,
        throwAngle: deg2rad(30),
        flip: true,
        cdThrow: 3,
        cdAtk: 3,
        update() {
            this.target = get('player')[0]
            let d = this.target.pos.x + this.target.width/2 - this.pos.x

            if(this.cdThrow > 0) this.cdThrow -= dt()
            if(this.cdAtk > 0) this.cdAtk -= dt()
            if(this.cdThrow <= 0) {
                this.enterState('throw')
                this.cdThrow = 3
            }
            else if(this.cdAtk <= 0 && d <= 250) {
                this.enterState('attack')
                this.cdAtk = 3
            }

            this.moveTo(this.pos.lerp(vec2(this.target.pos.x + this.target.width/2, this.pos.y), 0.01))
            if(d > 0) this.flipX(this.flip = true)
            else this.flipX(this.flip = false)
        },
        load() {
            this.onStateEnter('attack', () => {
                this.play('atkprep')
                wait(0.7, () => {
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
                    wait(0.3, () => {
                        this.enterState('idle')
                    })
                })
            })
            this.onStateEnter('throw', () => {
                this.play('throw')
                wait(1.3, () => {
                    let x = this.target.pos.x - this.pos.x + 65 + this.target.width/2
                    let y = this.target.pos.y - this.pos.y + 70 + this.target.height/2
                    let v = Math.sqrt(gravity() / (2*(Math.tan(this.throwAngle)*x + y))) * x / Math.cos(this.throwAngle)
                    add([
                        sprite('throwed-pepper', {anim: 'rotating'}),
                        pos(this.pos.sub(65, 70)),
                        origin('center'),
                        area(),
                        body({solid: false}),
                        move(-rad2deg(this.throwAngle), v),
                        rotate(10),
                        {
                            load() {
                                this.onCollide('wall', () => {
                                    timedGas(this.pos.x, this.pos.y, 30, 5)
                                    destroy(this)
                                })
                                this.onCollide('player', (p) => {
                                    p.die()
                                    timedGas(this.pos.x, this.pos.y, 30, 5)
                                    destroy(this)
                                })
                            }
                        }
                    ])
                    wait(0.1, () => {
                        this.enterState('idle')
                    })
                })
            })
            this.onStateEnter('idle', () => {
                this.play('idle')
                wait(1, () => {
                    this.enterState('throw')
                })
            })
            this.enterState('idle')
        }
    }
}