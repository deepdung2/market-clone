import { writable } from "svelte/store";

export const user$ = writable(null); //쓰고 수정할 수 있는 값 (svelte store 문법)
