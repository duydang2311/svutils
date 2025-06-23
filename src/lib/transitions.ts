import __gsap from 'gsap';
import type { TransitionConfig } from 'svelte/transition';

/**
 * A dummy transition function that returns the provided transition configuration or an empty object.
 *
 * @param _node - The DOM element to which the transition would be applied (unused).
 * @param config - Optional transition configuration object.
 * @returns The provided transition configuration, or an empty object if none is provided.
 */
export const dummy = (_node: Element, config?: TransitionConfig) => {
    return config ?? {};
};

/**
 * Creates a Svelte-compatible transition configuration using a GSAP animation.
 *
 * @param gsap - The GSAP instance to use for creating animations.
 * @returns A function that takes a DOM node and a callback to create a GSAP animation,
 *          returning a Svelte `TransitionConfig` object.
 *
 * @example
 * import __gsap from 'gsap';
 * import { createGSAPTransition } from './transitions';
 *
 * // If you want a custom GSAP instance with default options, otherwise just pass `gsap` directly
 * const customGsap = Object.assign({}, __gsap, {
 *   to: (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => __gsap.to(targets, { overwrite: 'auto', duration: 0.15, ...vars }),
 *   from: (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => __gsap.from(targets, { overwrite: 'auto', duration: 0.15, ...vars }),
 *   fromTo: (
 *     targets: gsap.TweenTarget,
 *     fromVars: gsap.TweenVars,
 *     toVars: gsap.TweenVars,
 *   ): gsap.core.Tween => __gsap.fromTo(targets, { overwrite: 'auto', ...fromVars }, { overwrite: 'auto', duration: 0.15, ...toVars }),
 * });
 *
 * // Inject a gsap instance. Create once and reuse it across your app
 * const tsap = createGSAPTransition(customGsap);
 *
 * // Use it in a Svelte component, gsap vars will have overwrite as 'auto' by default
 * <span in:tsap={(node, gsap) => gsap.from(node, { opacity: 0 })}>Hello world</span>
 */
export const createGSAPTransition =
    (gsap: typeof __gsap) =>
    (
        node: Element,
        fn: (
            node: Element,
            gsap: typeof __gsap,
        ) => gsap.core.Animation | undefined | null,
    ) => {
        const animation = fn(node, gsap);
        return (
            animation == null
                ? {}
                : {
                      delay: animation.delay(),
                      duration: animation.totalDuration() * 1000,
                  }
        ) satisfies TransitionConfig;
    };
