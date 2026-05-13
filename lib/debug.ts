/**
 * This file contains the debug instances for the application.
 *
 * @see https://github.com/debug-js/debug
 */

import createDebug from 'debug';

/**
 * Base debug instance for tRPC.
 * You can use it as is, or extend it with `trpcDebug.extend('my-feature')`
 * to create a new debug instance for a specific feature.
 *
 * @example
 * ```typescript
 * const myFeatureDebug = trpcDebug.extend('my-feature');
 * myFeatureDebug('my message');
 *
 * // This will log the message with the base namespace `trpc:my-feature my message`
 * ```
 */
export const trpcDebug = createDebug('trpc');
