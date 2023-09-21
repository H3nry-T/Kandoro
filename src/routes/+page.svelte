<script>
	import KanbanCard from '$lib/components/KanbanPage/KanbanCard.svelte';
	import KanbanColumn from '$lib/components/KanbanPage/KanbanColumn.svelte';
	import CardTransition from '$lib/components/animation/CardTransition.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import { userStore } from '$lib/stores/authStore';
	import { animateAddCard, playAddCardAnimation } from '$lib/stores/cardAnimationStore';
	import { addTodos, loadTodos, todos } from '$lib/stores/todosStore';
	import { Plus } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let form = {
		title: ''
	};

	$: column1 = $todos
		.filter((t) => t.column_number === 1)
		.sort((a, b) => a.row_number - b.row_number);
	$: column2 = $todos
		.filter((t) => t.column_number === 2)
		.sort((a, b) => a.row_number - b.row_number);
	$: column3 = $todos
		.filter((t) => t.column_number === 3)
		.sort((a, b) => a.row_number - b.row_number);
</script>

<section class="min-h-screen px-5 md:px-2 lg:px-20">
	<div
		class="absolute w-64 h-64 opacity-50 pointer-events-none l-0 t-0 filter blur-3xl bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 animate-slowBlob"
	/>
	<h1 class="relative mb-10 text-4xl font-semibold tracking-tight first-letter:capitalize">
		svelte-kanban
	</h1>

	<form
		class="relative flex items-center justify-center w-full max-w-sm gap-4 mb-5 rounded-lg text-card-foreground"
		on:submit|preventDefault={async () => {
			if (form.title.length > 0 && $userStore !== null) {
				await addTodos(form, $userStore?.id);
				playAddCardAnimation(500);
				form.title = '';
			}
		}}
	>
		<fieldset class="flex items-center w-full gap-4">
			<Input
				class="w-full max-w-2xl py-0 bg-card"
				bind:value={form.title}
				type="text"
				name="title"
				id="title"
				required
				placeholder="Add todo"
			/>
			<Button class="py-0 border border-gray-600" size={'icon'} type="submit"><Plus /></Button>
		</fieldset>
	</form>

	<section class="relative pb-10">
		<section class="grid items-start grid-cols-1 gap-4 mt-10 md:gap-1 md:grid-cols-3 lg:gap-4">
			<KanbanColumn column={column1} columnNumber={1} />
			<KanbanColumn column={column2} columnNumber={2} />
			<KanbanColumn column={column3} columnNumber={3} />
		</section>
	</section>
</section>
