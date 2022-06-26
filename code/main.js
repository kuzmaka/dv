import init from './init'
import loadAssets from './loadAssets'
import start from './start'
import intro from './intro'

init()

loadAssets()

scene('start', start)
scene('intro', intro)

go('start')
// go('intro')
