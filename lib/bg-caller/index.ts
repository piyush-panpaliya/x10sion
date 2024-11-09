import { ControllerRecord, Message, Procedure, RPCActions } from './types'

class RPCRouter<T extends ControllerRecord> {
  public procedures: T

  constructor(procedures: T) {
    this.procedures = { ...procedures }
  }

  merge<U extends ControllerRecord>(
    otherRouter: RPCRouter<U>
  ): RPCRouter<T & U> {
    return new RPCRouter({ ...this.procedures, ...otherRouter.procedures })
  }

  private async getProcedure(
    current: ControllerRecord,
    parts: string[]
  ): Promise<Procedure<any[], any> | undefined> {
    const [part, ...rest] = parts
    const next = current[part]
    if (!next) {
      throw new Error(`Procedure not found at path: ${parts.join('.')}`)
    }
    if (rest.length === 0) {
      if (typeof next === 'function') {
        return next
      }
      throw new Error(
        `Path does not lead to a callable procedure: ${parts.join('.')}`
      )
    }
    if (next instanceof RPCRouter) {
      return this.getProcedure(next.procedures, rest)
    }
    throw new Error(`Invalid path: ${parts.join('.')}`)
  }

  async handle(msg: Message<string, any[]>) {
    try {
      const parts = msg.action.split('.')
      const procedure = await this.getProcedure(this.procedures, parts)
      if (!procedure) {
        throw new Error(`Procedure not found at path: ${msg.action}`)
      }
      const data = await procedure(...msg.value)
      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}
export type { RPCRouter }

export const createRouter = <T extends ControllerRecord>(
  functions: T
): RPCRouter<T> => {
  return new RPCRouter(functions)
}
export const handleRPC = <T extends RPCRouter<any>>(router: T) => {
  chrome.runtime.onMessage.addListener((msg, _, response) => {
    Promise.resolve(router.handle(msg)).then((res) => response(res))
    return true
  })
}
export const bgCaller = <T extends RPCRouter<any>>() => {
  type RootActions = RPCActions<T>
  return async function rpc<Action extends string & RootActions['action']>(
    action: Action,
    ...args: Extract<RootActions, { action: Action }>['args']
  ): Promise<Extract<RootActions, { action: Action }>['return']> {
    const message: Message<Action, any[]> = {
      action,
      value: args,
    }
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.data)
        }
      })
    })
  }
}
