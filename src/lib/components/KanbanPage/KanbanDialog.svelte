<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { CheckCircle, FileEdit } from 'lucide-svelte';
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
			<fieldset>
				<select
					class="w-full bg-primary-foreground text-primary"
					name="priority"
					bind:value={updatedPriority}
					on:change={(e) => {
						hasBeenEdited = false;
					}}
				>
					<option disabled value={null}>priority:</option>
					<option value={1}>low</option>
					<option value={2}>medium</option>
					<option value={3}>high</option>
				</select>
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
