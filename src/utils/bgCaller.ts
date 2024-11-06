import { bgCaller } from '../../lib/bg-caller'
import { Caller } from '../../lib/bg-caller/types'
import { ControllerRecord } from '../background'

export const rpc: Caller<ControllerRecord> = bgCaller
