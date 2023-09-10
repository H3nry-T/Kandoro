// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface Todo {
	column_number: number;
	created_at: string;
	id: number;
	is_done: boolean;
	title: string;
	user_id: string;
}

export {};
