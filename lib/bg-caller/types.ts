// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ControllerRecord = Record<string, (...args: any[]) => any>
export type Arguments<J extends ControllerRecord, T> = T extends keyof J
  ? Parameters<J[T]>
  : never

export type Message<J extends ControllerRecord, T extends keyof J> = {
  action: T
  value: Arguments<J, T>
}

export type Caller<J extends ControllerRecord> = <T extends keyof J>(
  action: T,
  ...args: Arguments<J, T>
) => Promise<NonNullable<Awaited<ReturnType<J[T]>>>>
