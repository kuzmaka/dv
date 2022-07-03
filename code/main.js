import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'
import city from './city'
import office from './office'
import loadSounds from "./loadSounds";
import win from "./win";

init()

loadAssets()
loadSounds()

scene('intro', (...args) => {intro(...args)})
scene('city', city)
scene('office', office)
scene('win', win)

debug.inspect = false

go('win')
// go('intro', {final: false})
// go('intro', {final: true})
// go('city')
// go('office')
