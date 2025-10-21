import { untrack } from 'svelte';

export interface Ref<T> {
    current: T;
}

export interface AsyncRef<T> extends Ref<T | undefined> {
    loading: boolean;
}

class SvelteRef<T> implements Ref<T> {
    current = $state.raw<T>(undefined!);
    constructor(value?: T) {
        if (value !== undefined) {
            this.current = value;
        }
    }
}

export function createRef<T>(): Ref<T | undefined>;
export function createRef<T>(fn: () => Promise<T>): AsyncRef<T>;
export function createRef<T>(fn: () => T): Ref<T>;
export function createRef<T>(value: Promise<T>): AsyncRef<T>;
export function createRef<T>(value: T): Ref<T>;
export function createRef<T>(valueOrFn?: T | (() => T)) {
    const ref = new SvelteRef<T>();
    if (typeof valueOrFn === 'function') {
        const fn = valueOrFn as () => T | Promise<T>;
        const initialValue = fn();
        if (initialValue instanceof Promise) {
            initialValue.then((resolved) => {
                ref.current = resolved;
            });
        } else {
            ref.current = initialValue;
        }
        $effect.pre(() => {
            const value = fn();
            untrack(() => {
                if (value instanceof Promise) {
                    value.then((resolved) => {
                        ref.current = resolved;
                    });
                } else {
                    ref.current = value;
                }
            });
        });
    } else {
        const value = valueOrFn as T | Promise<T> | undefined;
        if (value instanceof Promise) {
            value.then((resolved) => {
                ref.current = resolved;
            });
        } else if (value) {
            ref.current = value;
        }
    }
    return ref;
}
