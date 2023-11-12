import type { Map } from 'maplibre-gl';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const activeIndex = writable(-1);
export const areaActive = writable(false);
export const areaGeoJSON = writable({});
export const areaProperties: Writable<string[]> = writable([]);
export const choices: Writable<unknown[]> = writable([]);
export const data = writable([]);
export const formValid = writable(false);
export const map: Writable<Map> = writable();
export const survey: Writable<unknown[]> = writable([]);
