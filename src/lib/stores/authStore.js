import { writable } from 'svelte/store';
/**
 * @type {import('svelte/store').Writable<null | import('@supabase/supabase-js').User>}
 */
export const userStore = writable(null);
