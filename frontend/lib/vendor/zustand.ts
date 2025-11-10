'use client'

// Minimal client-side stand-in for `zustand`. The imports in this repo still use
// `import { create } from 'zustand'` so the code matches production, but we alias
// the module to this file locally so the mock UI can run without installing the
// real package. When transplanting to prod, the genuine dependency will satisfy
// the same API surface.

import { useRef, useSyncExternalStore } from 'react'

type SetState<T extends object> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
) => void

type GetState<T extends object> = () => T
type Subscriber<T extends object> = (state: T, previousState: T) => void

export interface StoreApi<T extends object> {
  setState: SetState<T>
  getState: GetState<T>
  subscribe: (listener: Subscriber<T>) => () => void
  destroy: () => void
}

export type StateCreator<T extends object> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>,
) => T

export type UseBoundStore<T extends StoreApi<object>> = {
  (): ReturnType<T['getState']>
  <U>(selector: (state: ReturnType<T['getState']>) => U, equalityFn?: (a: U, b: U) => boolean): U
} & T

const createImpl = <T extends object>(createState: StateCreator<T>) => {
  let state: T
  const listeners = new Set<Subscriber<T>>()

  const setState: SetState<T> = (partial, replace) => {
    const nextState =
      typeof partial === 'function' ? (partial as (state: T) => T | Partial<T>)(state) : partial
    const value = replace ? (nextState as T) : Object.assign({}, state, nextState)
    const previousState = state
    state = value
    listeners.forEach((listener) => listener(state, previousState))
  }

  const getState: GetState<T> = () => state

  const subscribe = (listener: Subscriber<T>) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  const api: StoreApi<T> = {
    setState,
    getState,
    subscribe,
    destroy: () => listeners.clear(),
  }

  state = createState(setState, getState, api)

  const useBoundStore = (<U>(
    selector: (state: T) => U = (s: T) => s as unknown as U,
    equalityFn: (a: U, b: U) => boolean = Object.is,
  ) => {
    const sliceRef = useRef(selector(state))
    return useSyncExternalStore(
      subscribe,
      () => {
        const nextSlice = selector(getState())
        if (!equalityFn(sliceRef.current, nextSlice)) {
          sliceRef.current = nextSlice
        }
        return sliceRef.current
      },
      () => sliceRef.current,
    )
  }) as UseBoundStore<StoreApi<T>>

  Object.assign(useBoundStore, api)
  return useBoundStore
}

export function create<T extends object>(createState: StateCreator<T>): UseBoundStore<StoreApi<T>>
export function create<T extends object>(): (
  createState: StateCreator<T>,
) => UseBoundStore<StoreApi<T>>
export function create<T extends object>(createState?: StateCreator<T>) {
  if (createState) {
    return createImpl(createState)
  }
  return (initializer: StateCreator<T>) => createImpl(initializer)
}

export default create
