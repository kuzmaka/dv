import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'
import office from './office'

init()

loadAssets()

// scene('start', start)
scene('intro', intro)
scene('office', office)

debug.inspect = false

go('intro')
// go('office')
