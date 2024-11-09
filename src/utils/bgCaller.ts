import { bgCaller } from '@lib/bg-caller'

import { RouterTypes } from '../background'

export const rpc = bgCaller<RouterTypes>()
