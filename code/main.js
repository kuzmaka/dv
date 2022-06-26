import init, {SKIP_START} from './init'
import loadAssets from './loadAssets'
import start from './start'
import intro from './intro'

init()

loadAssets()

scene('start', start)
scene('intro', intro)

if (!SKIP_START) {
    go('start')
} else {
    go('intro')
}

