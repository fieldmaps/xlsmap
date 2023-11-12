import type { Map } from 'maplibre-gl';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const map: Writable<Map> = writable();
export const data = writable([]);
export const areaProperties: Writable<string[]> = writable([]);
export const areaActive = writable(false);
export const formValid = writable(true);
export const survey: Writable<unknown[]> = writable([]);
export const choices: Writable<unknown[]> = writable([]);
export const activeIndex = writable(-1);
