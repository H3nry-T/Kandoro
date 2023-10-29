<script>
	import {
		updateRowNumbersForColumn,
		todos,
		updateColumnNumber,
		updateRowNumber,
		loadTodos
	} from '$lib/stores/todosStore';
	import { fade, fly } from 'svelte/transition';
	import * as Card from '../ui/card/index';
	import KanbanCard from './KanbanCard.svelte';
	import {
		animateAddCard,
		finalizingCard,
		playAddCardAnimation,
		playFinalizeCardAnimation
	} from '$lib/stores/cardAnimationStore';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	/**
	 * @type {import('$lib/stores/todosStore').Todo[]}
	 */
	export let column;

	/**
	 * @type {number} columnNumber
	 */
	export let columnNumber;

	let flipDurationMs = 200;

	/**
	 *
	 * @param {*} e
	 */
	function handleConsider(e) {
		column = e.detail.items;
	}

	/**
	 * @param {CustomEvent<import('svelte-dnd-action').DndEvent<import('$lib/stores/todosStore').Todo>>} e
	 */
	async function handleFinalize(e) {
		try {
			const syncedColumnRows = e.detail.items.map((todo, index) => {
				return { ...todo, row_number: index + 1, column_number: columnNumber };
			});
			column = syncedColumnRows;
			const draggedTodoId = +e.detail.info.id;
			finalizingCard.set(draggedTodoId);
			playFinalizeCardAnimation(500);

			const draggedTodo = $todos.find((todo) => {
				return todo.id === draggedTodoId;
			});
			if (draggedTodo) {
				const finalizedDraggedTodo = syncedColumnRows.find((todo) => todo.id === draggedTodoId);
				if (columnNumber === finalizedDraggedTodo?.column_number) {
					console.log(
						`dragged ${draggedTodo.title} col ${draggedTodo.column_number} row ${draggedTodo.row_number} console log from column ${columnNumber}`
					);
					console.log(
						`finalized ${finalizedDraggedTodo?.title} col ${finalizedDraggedTodo?.column_number} row ${finalizedDraggedTodo?.row_number} console log from column ${columnNumber}`
					);
				}
				if (finalizedDraggedTodo) {
					await Promise.all([
						updateColumnNumber(draggedTodoId, finalizedDraggedTodo?.column_number),
						updateRowNumbersForColumn(syncedColumnRows)
					]);
					await loadTodos();
				}
			}
		} catch (error) {
			console.error(error);
			throw new Error(`${error}`);
		}
	}
</script>

<section class="md:min-h-screen">
	<Card.Root class="w-full p-5 pt-4">
		<h2
			class="mb-4 text-xl font-semibold tracking-tight md:text-2xl first-letter:capitalize text-secondary-foreground"
		>
			{columnNumber === 1 ? 'ice-box' : columnNumber === 2 ? 'in-progress' : 'done'}
		</h2>
		<slot />
		{#if columnNumber === 1}
			<div
				use:dndzone={{
					items: column,
					flipDurationMs,
					dropTargetStyle: {},
					dropTargetClasses: [
						'border',
						'border-black',
						'dark:border-accent-foreground',
						'pb-12',
						'rounded-md'
					]
				}}
				on:consider={handleConsider}
				on:finalize={handleFinalize}
				class="flex flex-col gap-4 min-h-[100px] max-h-[80vh] overflow-y-scroll"
			>
				{#each column as todo (todo.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						{#if todo.id === $todos[$todos.length - 1].id}
							<KanbanCard {todo} isLast={true} />
						{:else}
							<KanbanCard {todo} />
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div
				use:dndzone={{
					items: column,
					flipDurationMs,
					dropTargetStyle: {},
					dropTargetClasses: [
						'border',
						'border-foreground',
						'dark:border-accent-foreground',
						'pb-12',
						'rounded-md'
					]
				}}
				on:consider={handleConsider}
				on:finalize={handleFinalize}
				class="flex flex-col gap-4 min-h-[100px] pb-10 max-h-[80vh] overflow-y-scroll"
			>
				{#each column as todo (todo.id)}
					<div animate:flip={{ duration: flipDurationMs }}>
						<KanbanCard {todo} />
					</div>
				{/each}
			</div>
		{/if}
	</Card.Root>
</section>
