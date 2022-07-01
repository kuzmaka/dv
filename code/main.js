import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'
import city from './city'
import office from './office'
import lab_final from './lab_final'
import loadSounds from "./loadSounds";

init()

loadAssets()
loadSounds()

scene('intro', (...args) => {intro(...args)})
scene('city', city)
scene('office', office)
// scene('lab-final', lab_final)

debug.inspect = false

// go('intro', {})
// go('intro', {hasBlueKey: true})
go('city')
// go('office')
// go('lab-final')
