import { Arguments, ControllerRecord, Message } from './types'

const handleMessage = async <J extends ControllerRecord, T extends keyof J>(
  msg: Message<J, T>,
  controllers: J
) => {
  if (!msg.action || !(msg.action in controllers)) {
    return { data: null, error: 'Unknown action' }
  }
  const { action }: { action: T } = msg
  const controller = controllers[action]
  try {
    const data = await controller(...msg.value)
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export function createRPC<J extends ControllerRecord>(controllers: J) {
  chrome.runtime.onMessage.addListener((msg, _, response) => {
    Promise.resolve(handleMessage(msg, controllers)).then((res) =>
      response(res)
    )
    return true
  })
}

export const bgCaller = async <J extends ControllerRecord, T extends keyof J>(
  action: T,
  ...args: Arguments<J, T>
): Promise<NonNullable<Awaited<ReturnType<J[T]>>>> => {
  const msg: Message<J, T> = { action, value: args }
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response.data)
      }
    })
  })
}
