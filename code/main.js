import init from './init'
import loadAssets from './loadAssets'
import intro from './intro'

init()

loadAssets()

scene('intro', intro)
go('intro')