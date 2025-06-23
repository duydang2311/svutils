import { untrack } from 'svelte';

/**
 * Creates a reactive watcher that runs a provided function whenever the dependencies change.
 *
 * @param depsFn - A function that returns the dependencies to watch. The function is called to track dependencies.
 * @returns A function that takes an effect function `fn`, which will be executed when the dependencies change.
 *
 * @example
 * const stop = watch(() => state)(() => {
 *   // Effect logic here
 * });
 *
 * @remarks
 * The effect function can optionally return a cleanup function, which will be called before the effect re-runs.
 */
export const watch = (depsFn: () => unknown) => {
    return (fn: () => void | (() => void)) => {
        $effect(() => {
            depsFn();
            return untrack(() => fn());
        });
    };
};

/**
 * A variant of `watch` that runs before the DOM is updated.
 *
 * @param depsFn - A function that returns the dependencies to watch. The function is called to track dependencies.
 * @returns A function that takes an effect function `fn`, which will be executed when the dependencies change before the DOM is updated.
 * @example
 * const stop = watch(() => state)(() => {
 *   // Effect logic here
 * });
 * @remarks
 * The effect function can optionally return a cleanup function, which will be called before the effect re-runs.
 */
watch.pre = (depsFn: () => unknown) => {
    return (fn: () => void | (() => void)) => {
        $effect.pre(() => {
            depsFn();
            return untrack(() => fn());
        });
    };
};
