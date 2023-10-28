<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { CheckCircle, ChevronDown, FileEdit } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select';
	import { updateTodoFieldsById } from '$lib/stores/todosStore';
	/**
	 * @type {boolean} hasBeenEdited
	 */
	export let hasBeenEdited;

	/**
	 * @type {string} updatedTitle
	 */
	export let updatedTitle;

	/**
	 * @type {string} updatedDescription
	 */
	export let updatedDescription;

	/**
	 * @type {number | null} updatedPriority
	 */
	export let updatedPriority;

	/**
	 * @type {import('$lib/stores/todosStore').Todo} todo
	 *
	 */
	export let todo;
</script>

<Dialog.Root
	onOpenChange={(open) => {
		if (open) {
			hasBeenEdited = false;
			updatedTitle = todo.title;
			updatedDescription = todo.description;
		}
	}}
>
	<Dialog.Trigger class="grid place-items-center"
		><Button
			class="p-0 h-[25px] w-[25px] leading-none border bg-card group hover:bg-gray-400/10"
			size="icon"
			variant="secondary"
			><FileEdit
				size={20}
				class="transition-all duration-300 ease-in-out group-hover:text-gray-400"
			/></Button
		></Dialog.Trigger
	>
	<Dialog.Content class="flex flex-col gap-8">
		<Dialog.Header>
			<Dialog.Title>Edit the todo here:</Dialog.Title>
		</Dialog.Header>
		<form class="flex flex-col w-full gap-5" on:submit|preventDefault>
			<fieldset class="flex flex-col gap-3">
				<Label for="title" class="first-letter:capitalize">title</Label>
				<Input
					placeholder={todo.title}
					id="title"
					bind:value={updatedTitle}
					on:keydown={() => {
						hasBeenEdited = false;
					}}
				/>
			</fieldset>
			<fieldset class="flex flex-col gap-3">
				<Label for="title" class="first-letter:capitalize">add a description</Label>
				<Textarea
					name="description"
					id="description"
					cols={30}
					rows={10}
					placeholder={todo.description}
					bind:value={updatedDescription}
					on:keydown={() => {
						hasBeenEdited = false;
					}}
				/>
			</fieldset>
			<fieldset
				class="relative p-[1px] overflow-hidden rounded-md focus-within:outline-double focus-within:outline-2 focus-within:outline-primary"
			>
				<select
					class={`w-full px-2 py-1 text-sm border-2  appearance-none bg-card text-card-foreground hover:cursor-pointer ${
						updatedPriority === 1
							? 'border-green-900'
							: updatedPriority === 2
							? 'border-yellow-900'
							: updatedPriority === 3
							? 'border-red-900'
							: 'border-primary'
					}`}
					name="priority"
					bind:value={updatedPriority}
					on:change={(e) => {
						hasBeenEdited = false;
					}}
				>
					<option disabled value={null}>Priority:</option>
					<option value={1}>Low</option>
					<option value={2}>Medium</option>
					<option value={3}>High</option>
				</select>
				<span
					class="absolute top-0 right-0 grid h-full bg-transparent pointer-events-none place-items-center w -7"
					><ChevronDown class="mr-1" /></span
				>
			</fieldset>
			<Button
				class="grid place-items-center"
				type="submit"
				on:click={() => {
					updateTodoFieldsById(todo.id, updatedTitle, updatedDescription, updatedPriority);
					hasBeenEdited = true;
				}}
			>
				{#if !hasBeenEdited}
					<p class="first-letter:capitalize">save changes</p>
				{:else}
					<CheckCircle />
				{/if}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
