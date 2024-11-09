import { RPCRouter } from '.'

export type Procedure<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Promise<Return> | Return

export type ControllerRecord = {
  [key: string]: Procedure | RPCRouter<any>
}
export interface Message<Action extends string, Args extends any[]> {
  action: Action
  value: Args
}

export type RPCActions<T extends RPCRouter<any>> = {
  [K in keyof T['procedures']]: T['procedures'][K] extends Procedure<
    infer A,
    infer R
  >
    ? { action: K; args: A; return: R }
    : T['procedures'][K] extends RPCRouter<infer U>
      ? RPCActions<RPCRouter<U>> extends infer P
        ? P extends { action: infer A; args: infer B; return: infer C }
          ? { action: `${K & string}.${A & string}`; args: B; return: C }
          : never
        : never
      : never
}[keyof T['procedures']]
