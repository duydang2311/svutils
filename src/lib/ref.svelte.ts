import { untrack } from 'svelte';

/**
 * A generic interface representing a mutable reference to a value of type `T`.
 *
 * @template T - The type of the value being referenced.
 * @property current - The current value being referenced.
 */
export interface Ref<T> {
    current: T;
}

class SvelteRef<T> implements Ref<T> {
    current = $state.raw<T>(undefined!);
    constructor(value?: T) {
        if (value !== undefined) {
            this.current = value;
        }
    }
}

interface CreateRef {
    <T>(): Ref<T | undefined>;
    <T>(fn: () => T): Ref<T>;
    <T>(value: T): Ref<T>;
}

/**
 * Creates a reactive `Ref` that initializes with a given value or from a function.
 *
 * If a function is provided, the reference will automatically update its value
 * whenever the function's result changes, using `$effect.pre`
 * If a value is provided, the reference will simply hold that value.
 *
 * @typeParam T - The type of the value to be referenced.
 * @param valueOrFn - The initial value or a function that returns the value to be referenced.
 * @returns A `Ref<T>` instance that holds the value and updates reactively if a function is provided.
 */
export const createRef: CreateRef = <T>(valueOrFn?: T | (() => T)): Ref<T> => {
    let ref: Ref<T>;
    if (typeof valueOrFn === 'function') {
        const fn = valueOrFn as () => T;
        ref = new SvelteRef<T>(fn());
        $effect.pre(() => {
            const value = fn();
            untrack(() => {
                ref.current = value;
            });
        });
    } else {
        ref = new SvelteRef<T>(valueOrFn);
    }
    return ref;
};
