import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'
import office from './office'
import lab_final from './lab_final'
import loadSounds from "./loadSounds";

init()

loadAssets()
loadSounds()

scene('intro', (...args) => {intro(...args)})
scene('office', office)
scene('lab-final', lab_final)

debug.inspect = false

// go('intro', {})
go('intro', {hasBlueKey: true})
// go('office')
// go('lab-final')
