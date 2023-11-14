<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { CheckCircle, ChevronDown, File, FileEdit } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select';
	import { updateTodoFieldsById } from '$lib/stores/todosStore';

	/**
	 * @type {import('$lib/stores/todosStore').Todo} todo
	 *
	 */
	export let todo;

	let updatedTitle = todo.title || '';
	let updatedDescription = todo.description || '';
	let updatedPriority = todo.priority || null;
	let hasBeenEdited = false;
	let updatedMedia = todo.media || null;

	/**
	 * @type {FileList} inputFileObject
	 */
	let inputFileObject;
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
	<Dialog.Content class="flex flex-col gap-8 overflow-y-scroll max-h-[70vh]">
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
			<section class="">
				{#if todo.media}
					<img src={todo.media} alt="media" />
				{/if}
			</section>
			<fieldset
				class="relative overflow-hidden rounded-md focus-within:ring-offset-2 focus-within:ring-2 focus-within:ring-primary bg-card"
			>
				<select
					class={`w-full px-2 py-1 text-sm border-2 appearance-none bg-card text-card-foreground hover:cursor-pointer hover:bg-muted transition-all duration-300 ease-in-out ${
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
					<option value={undefined}>None</option>
					<option value={1}>Low</option>
					<option value={2}>Medium</option>
					<option value={3}>High</option>
				</select>
				<span
					class="absolute top-0 right-0 grid h-full bg-transparent pointer-events-none place-items-center w-7"
					><ChevronDown class="mr-1" /></span
				>
			</fieldset>
			<fieldset class="relative w-full group">
				<input
					class="absolute inset-0 opacity-0 cursor-pointer peer"
					type="file"
					name="media"
					id="media"
					bind:files={inputFileObject}
					on:change={() => {
						hasBeenEdited = false;
						console.log(inputFileObject[0]);
					}}
				/>
				<label
					class="flex items-center gap-2 px-4 py-2 text-sm leading-none transition-all duration-200 ease-in-out border rounded-md group-focus-within:ring-offset-2 ring-offset-card group-focus-within:ring-2 group-focus-within:ring-primary bg-card peer-hover:bg-muted"
					for="media"
					><File /> Upload a file
				</label>
				{#if inputFileObject}
					<p class="mt-2 text-sm">{inputFileObject[0].name}</p>
				{/if}
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
