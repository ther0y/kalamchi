import { Base64 } from './utils/Base64.js';
import {browser} from "$app/env";

type SetterGetter<T> = {set: (T) => void, get: () => T};

class EncryptedLocalstorage {
	constructor(private name: string) {}

	get() {
		if(!browser) return null;
		const item = localStorage.getItem(this.name);
		return item && Base64.decode(item);
	}

	set(value) {
		if(!browser) return;
		localStorage.setItem(this.name, Base64.encode(value));
	}
}

export const LsBox = (name: string): SetterGetter<string> => {
  return new EncryptedLocalstorage(name);
}

export function EncBox(value: string): SetterGetter<string> {
	let secret = Base64.encode(value);

	return {
		get() {
			return Base64.decode(secret);
		},
		set(newValue: string) {
			secret = Base64.encode(newValue);
		}
	}
}