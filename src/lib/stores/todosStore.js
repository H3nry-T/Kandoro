import { writable } from 'svelte/store';
import { supabase } from '../supabase';
import { userStore } from '$lib/stores/authStore';

/**
 * @typedef {Object} Todo
 * @property {number} column_number
 * @property {string} created_at
 * @property {number} id
 * @property {boolean} is_done
 * @property {string} title
 * @property {string} user_id
 * @property {string} description
 * @property {number} row_number
 * @property {number | null} priority
 * @property {{tag_name: string}} tags
 * @property {string | null} media
 */

/**
 * creating a svelte store for todos
 * @type {import('svelte/store').Writable<Todo[]>}
 */

export const todos = writable([]);

/**
 * set svelte store with loaded supabase todos
 * ?use this if you want to update the store after doing a database action?
 * @function loadTodos
 * @returns {Promise<void>}
 */

export async function loadTodos() {
	const { data, error } = await supabase
		.from('todos')
		.select('*, tags (tag_name)')
		.order('id', { ascending: true });
	if (error) {
		console.error(error);
	}

	console.log(`supabase read and load into svelte store`);
	todos.set(/** @type {Todo[]} */ (data));
}

/**
 * get todo from database using id
 * @param {number} id - number
 * @returns {Promise<Todo>}
 */
export async function getTodosById(id) {
	const { data, error } = await supabase.from('todos').select().match({ id });

	if (error) {
		console.error(error);
		throw error;
	}
	return data?.[0];
}
/**
 * inserts todo into the end of database
 * @param {{title: string}} todo
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function addTodos(todo, userId) {
	/*
		add a row_number to the todo object. It is dependent in column_number 1 and making sure it is the last index + 1
	*/
	const { data: readData, error: readError } = await supabase
		.from('todos')
		.select()
		.eq('column_number', 1)
		.order('id', { ascending: true });

	if (readError) {
		console.error(readError);
		throw readError;
	}

	const { data: insertData, error: insertError } = await supabase
		.from('todos')
		.insert([
			{ title: todo.title, is_done: false, user_id: userId, row_number: readData.length + 1 }
		])
		.select();

	if (insertError) {
		console.error(insertError);
		throw insertError;
	}

	console.debug(insertData);
	await loadTodos();
}

/**
 * Delete todos using id
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteTodos(id) {
	const { error } = await supabase.from('todos').delete().match({ id: id });
	if (error) {
		console.error(error);
	}

	console.log(`${id} todo deleted`);

	await loadTodos();
}

/**
 * updates the todos using id
 * @param {number} id
 * @param {boolean} todoIsDone
 * @returns {Promise<void>}
 */
export async function updateToggleTodos(id, todoIsDone) {
	const { data, error } = await supabase
		.from('todos')
		.update({ is_done: !todoIsDone })
		.match({ id: id })
		.select();

	if (error) {
		console.error(error);
	}

	console.log(`${id} todo toggled ${!todoIsDone}`);

	await loadTodos();
}

/**
 * updates the column number using todo id
 * STORE MUST NOT BE UPDATED TO NOT CONFLICT WITH SVELTE DND
 * animations is kept smooth this way
 * @function updateColumnNumber
 * @param {number} id
 * @param {number} columnNumber
 */
export async function updateColumnNumber(id, columnNumber) {
	const { data, error } = await supabase
		.from('todos')
		.update({ column_number: columnNumber })
		.match({ id: id })
		.select();

	if (error) {
		console.error(error);
	}
}

/**
 * updates the row number using todo id
 * (THIS SEEMS TO CAUSE JANKY ANIMATION ON STORE UPDATE)
 * reason is because svelte dnd updates positions and store refreshes as well.
 * ui reflects the store, but ui also reflects svelte dnd postions. so it flashes in and out of the dom.
 * @function updateRowNumber
 * @param {number} id
 * @param {number} rowNumber
 */
export async function updateRowNumber(id, rowNumber) {
	const { data, error } = await supabase
		.from('todos')
		.update({ row_number: rowNumber })
		.match({ id: id })
		.select();

	if (error) {
		console.error(error);
	}
}

/**
 * syncs the row numbers of the todos in the column when dropped into that column
 * the column needs to be pre-synced before calling this function
 * @param {import('$lib/stores/todosStore').Todo[]} syncedColumn - takes a presynced column of todos to map into the database
 */
export async function updateRowNumbersForColumn(syncedColumn) {
	const promises = syncedColumn.map((todo, i) => updateRowNumber(todo.id, i + 1));
	try {
		await Promise.all(promises);
	} catch (error) {
		console.error(error);
	}
}

/**
 * only update if the passed in title and description is relevant change.
 * @function updateTodoFieldsById
 * @param {number} id
 * @param {string} title
 * @param {string} description
 * @param {number | null | undefined} priority
 * @param {string | null | undefined} media
 * @returns {Promise<void>}
 */

export async function updateTodoFieldsById(id, title, description, priority, media) {
	const promises = [];
	if (title.length > 0) {
		const promiseTitleUpdate = supabase.from('todos').update({ title }).match({ id: id }).select();
		promises.push(promiseTitleUpdate);
	}

	if (description.length > 0) {
		const promiseDescriptionUpdate = supabase
			.from('todos')
			.update({ description })
			.match({ id: id })
			.select();

		promises.push(promiseDescriptionUpdate);
	}

	if (priority !== null) {
		if (priority === undefined) priority = null;
		const promisePriorityUpdate = supabase
			.from('todos')
			.update({ priority })
			.match({ id: id })
			.select();

		promises.push(promisePriorityUpdate);
	}

	if (media !== null) {
		if (media === undefined) media = null;
		const promiseMediaUpdate = supabase.from('todos').update({ media }).match({ id: id }).select();
		promises.push(promiseMediaUpdate);
	}

	try {
		await Promise.all(promises);
	} catch (error) {
		if (error) throw error;
	}

	await loadTodos();
}

/**
 * @function uploadMedia
 * @param {Todo} todo
 * @param {Todo["media"]} updatedMedia
 * @param {FileList} inputFileObject
 * @param {string} userId
 * @returns {Promise<void>}
 */

export async function insertOrUpdateBucket(todo, updatedMedia, inputFileObject, userId) {
	const { data } = await supabase.storage.from('images').list(userId + '/' + todo.id);
	if (data && data.length > 0) {
		await supabase.storage.from('images').remove([userId + '/' + todo.id + '/' + data[0].name]);
	}
	const { data: uploadedData, error } = await supabase.storage
		.from('images')
		.upload(userId + '/' + todo.id + '/' + updatedMedia, inputFileObject[0]);

	if (uploadedData) {
		console.log('successful uploading to bucket');
	}

	if (error) {
		console.log(error);
	}
}
