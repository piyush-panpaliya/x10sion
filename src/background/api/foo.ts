import { createRouter } from '@lib/bg-caller'

const controllers = {
  sayHello: (name: string) => `Hello, ${name}!`,
  add: (a: number, b: number) => {
    return a + b
  },
}
export const fooRouter = createRouter(controllers)
