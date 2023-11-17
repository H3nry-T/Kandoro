<script>
	import KanbanColumn from '$lib/components/KanbanPage/KanbanColumn.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { userStore } from '$lib/stores/authStore';
	import { playAddCardAnimation } from '$lib/stores/cardAnimationStore';
	import { addTodos, todos } from '$lib/stores/todosStore';
	import { Pause, Play, Plus, RotateCcw } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { dndzone } from 'svelte-dnd-action';

	let form = {
		title: ''
	};

	let minutes = 20;
	$: seconds = minutes * 60;
	$: showSeconds = seconds % 60;
	$: showMinutes = Math.floor((seconds * 1) / 60);
	let isPlaying = false;

	$: column1 = $todos
		.filter((t) => t.column_number === 1)
		.sort((a, b) => a.row_number - b.row_number);
	$: column2 = $todos
		.filter((t) => t.column_number === 2)
		.sort((a, b) => a.row_number - b.row_number);
	$: column3 = $todos
		.filter((t) => t.column_number === 3)
		.sort((a, b) => a.row_number - b.row_number);

	/**
	 * @type {NodeJS.Timeout} countdown
	 */

	let countdown;

	onMount(() => {
		return () => {
			clearInterval(countdown);
		};
	});
</script>

<section class="relative min-h-screen px-5 md:px-2 lg:px-20">
	<div
		class="absolute w-64 h-64 opacity-50 pointer-events-none l-0 t-0 filter blur-3xl bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 animate-slowBlob"
	/>

	<section class="max-w-[1920px] mx-auto">
		<h1 class="relative mb-10 text-4xl font-semibold tracking-tight first-letter:capitalize">
			Kan<span
				class="text-transparent bg-gradient-to-tr from-orange-400 via-blue-300 to-purple-400 bg-clip-text"
				>doro</span
			>
		</h1>
		<section class="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
			<form
				class="relative flex items-center justify-center w-full max-w-sm gap-4 rounded-lg text-card-foreground"
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
						class="w-full max-w-2xl py-0 text-base bg-card"
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
			<div
				class="relative flex items-center gap-2 text-3xl font-semibold leading-none tracking-tight md:text-4xl"
			>
				<h2>
					{showMinutes} : {#if 0 < showSeconds && showSeconds < 10}0{/if}{showSeconds}{#if seconds % 60 === 0}{0}{/if}
				</h2>
				<div class="grid grid-rows-2">
					<button
						class="grid p-0 text-xl rounded-md place-items-center text-foreground"
						on:click={() => {
							seconds += 60;
						}}
					>
						&uarr;
					</button>
					<button
						class="grid p-0 text-xl rounded-md place-items-center text-foreground"
						on:click={() => {
							if (seconds >= 60) seconds -= 60;
							else if (0 < seconds && seconds < 60) seconds = 0;
						}}
					>
						&darr;
					</button>
				</div>
				<Button
					size="icon"
					on:click={() => {
						seconds = minutes * 60;
					}}><RotateCcw size={20} /></Button
				><Button
					size="icon"
					on:click={() => {
						if (countdown) clearInterval(countdown);
						isPlaying = !isPlaying;
						countdown = setInterval(() => {
							if (seconds > 0 && isPlaying) {
								seconds -= 1;
							}
						}, 1000);
					}}
				>
					{#if isPlaying}
						<Pause />
					{:else}
						<Play size={20} />
					{/if}
				</Button>
			</div>
		</section>

		<section class="relative pb-10">
			<section class="grid items-start grid-cols-1 gap-4 mt-10 md:gap-1 md:grid-cols-3 lg:gap-4">
				<KanbanColumn column={column1} columnNumber={1} />
				<KanbanColumn column={column2} columnNumber={2} />
				<KanbanColumn column={column3} columnNumber={3} />
			</section>
		</section>
	</section>
</section>
