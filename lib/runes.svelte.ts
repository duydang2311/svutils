import { untrack } from 'svelte';

export const watch = (depsFn: () => unknown) => {
    return (fn: () => void | (() => void)) => {
        $effect(() => {
            depsFn();
            return untrack(() => fn());
        });
    };
};

watch.pre = (depsFn: () => unknown) => {
    return (fn: () => void | (() => void)) => {
        $effect.pre(() => {
            depsFn();
            return untrack(() => fn());
        });
    };
};
