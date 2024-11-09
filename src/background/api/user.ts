import { createRouter } from '@lib/bg-caller'

const controllers = {
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
  signout: async () => {
    console.log('signout')
    return Promise.resolve({ msg: 'signout done' })
  },
}

export const userRouter = createRouter(controllers)
