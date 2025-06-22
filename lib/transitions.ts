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
 * // If you want a custom GSAP instance with default options:
 * const myCustomGsap = Object.assign(__gsap, {
 *   to: (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => __gsap.to(targets, { overwrite: 'auto', ...vars }),
 *   from: (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => __gsap.from(targets, { overwrite: 'auto', ...vars }),
 *   fromTo: (
 *     targets: gsap.TweenTarget,
 *     fromVars: gsap.TweenVars,
 *     toVars: gsap.TweenVars,
 *   ): gsap.core.Tween => __gsap.fromTo(targets, fromVars, { overwrite: 'auto', ...toVars }),
 * });
 *
 * // Inject your custom GSAP. Create once and reuse throughout your app.
 * const tsap = createGSAPTransition(myCustomGsap);
 *
 * const fadeTransition = tsap(
 *   node,
 *   (node, gsap) => gsap.to(node, { opacity: 0, duration: 1 })
 * );
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
