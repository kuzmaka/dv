import kaboom from "kaboom"
import loadAssets from './loadAssets.js'
import intro from './intro.js'

// initialize context
kaboom()

loadAssets()

scene('intro', intro)
go('intro')