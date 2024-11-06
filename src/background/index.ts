import { createRPC } from '../../lib/bg-caller'

const controllers = {
  sayHello: (name: string) => `Hello, ${name}!`,
  add: (a: number, b: number) => {
    return a + b
  },
  p: async ({ a, b }: { a: number; b: number }) => {
    return Promise.resolve(a + b)
  },
  signin: async ({
    username,
    password,
  }: {
    username: string
    password: string
  }) => {
    console.log('signin', username, password)
    return Promise.resolve({ username, msg: 'signin done' })
  },
}
createRPC(controllers)

export type ControllerRecord = typeof controllers
