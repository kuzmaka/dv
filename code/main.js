import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'
import city from './city'
import office from './office'
import loadSounds from "./loadSounds";

init()

loadAssets()
loadSounds()

scene('intro', (...args) => {intro(...args)})
scene('city', city)
scene('office', office)

debug.inspect = false

go('intro', {final: false})
// go('intro', {final: true})
// go('city')
// go('office')
