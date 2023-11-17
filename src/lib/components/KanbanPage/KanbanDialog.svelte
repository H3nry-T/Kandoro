<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Calculator, CheckCircle, ChevronDown, Cross, File, FileEdit, X } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import Label from '../ui/label/label.svelte';
	import Input from '../ui/input/input.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import * as Select from '$lib/components/ui/select';
	import { updateTodoFieldsById, insertOrUpdateBucket, loadTodos } from '$lib/stores/todosStore';
	import { supabase } from '$lib/supabase';
	import { userStore } from '$lib/stores/authStore';

	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';

	/**
	 * @type {import('$lib/stores/todosStore').Todo} todo
	 *
	 */
	export let todo;
	/**
	 * !variable with value means database call
	 * ?variable with null means no database call
	 * *variable with undefined means database call to set null
	 */

	let updatedTitle = todo.title || '';
	let updatedDescription = todo.description || '';
	/**
	 * @type {number | null | undefined} updatedPriority
	 */
	let updatedPriority = todo.priority || null;
	let hasBeenEdited = false;

	/**
	 * @type {string | null | undefined} updatedMedia
	 */
	let updatedMedia = todo.media || null;

	/**
	 * @type {FileList | null} inputFileObject
	 */
	let inputFileObject = null;

	let loading = false;
	let wantToRemoveMedia = false;

	onMount(() => {
		/**
		 * @function handlePaste
		 * @param {ClipboardEvent} e
		 * @returns {void}
		 */
		function handlePaste(e) {
			if (e.clipboardData && e.clipboardData.files.length > 0) {
				inputFileObject = e.clipboardData.files;
			}
		}
		window.addEventListener('paste', handlePaste);
		return () => {
			window.removeEventListener('paste', handlePaste);
		};
	});
</script>

<Dialog.Root
	onOpenChange={(open) => {
		if (open) {
			hasBeenEdited = false;
			updatedTitle = todo.title;
			updatedDescription = todo.description;
		} else {
			wantToRemoveMedia = false;
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
			<section class="relative flex justify-center group">
				{#if todo.media && !wantToRemoveMedia}
					<Button
						variant="ghost"
						size="icon"
						class="absolute hidden w-6 h-6 p-0 border border-muted bg-gray-400/30 place-items-center top-1 right-1 group-hover:grid"
						on:click={async () => {
							wantToRemoveMedia = true;
						}}
						><X class="transition-all duration-300 ease-in-out" size={20} />
					</Button>
					<img
						src={`https://zsgzzosahrvhsgrhlycv.supabase.co/storage/v1/object/public/images/${$userStore?.id}/${todo.id}/${todo.media}`}
						alt="media"
					/>
				{/if}
			</section>
			<fieldset
				class="relative overflow-hidden rounded-md focus-within:ring-offset-2 focus-within:ring-offset-card focus-within:ring-2 focus-within:ring-primary bg-card"
			>
				<select
					class={`w-full px-2 py-2 text-sm border appearance-none bg-card text-card-foreground hover:cursor-pointer hover:bg-muted transition-all duration-300 ease-in-out ${
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
					}}
				/>
				<label
					class="flex items-center gap-2 px-2 py-2 text-sm leading-none transition-colors duration-200 ease-in-out border rounded-md group-focus-within:ring-offset-2 ring-offset-card group-focus-within:ring-2 group-focus-within:ring-primary bg-card peer-hover:bg-muted"
					for="media"
					><File /> Upload a file
				</label>
			</fieldset>
			{#if inputFileObject && inputFileObject.length > 0}
				<p class="text-sm">{inputFileObject[0].name}</p>
			{/if}
			<Button
				class="grid place-items-center"
				type="submit"
				on:click={async () => {
					hasBeenEdited = true;
					loading = true;
					if (inputFileObject && inputFileObject.length > 0 && $userStore) {
						updatedMedia = uuidv4();
						const { data } = await supabase.storage
							.from('images')
							.list($userStore?.id + '/' + todo.id);
						if (data && data.length > 0) {
							await supabase.storage
								.from('images')
								.remove([$userStore?.id + '/' + todo.id + '/' + data[0].name]);
						}
						const { data: uploadedData, error } = await supabase.storage
							.from('images')
							.upload($userStore.id + '/' + todo.id + '/' + updatedMedia, inputFileObject[0]);

						if (uploadedData) {
							console.log('successful uploading to bucket');
						}

						if (error) {
							console.log(error);
						}
					}
					if (wantToRemoveMedia) {
						try {
							updatedMedia = undefined;
							await supabase.storage
								.from('images')
								.remove([$userStore?.id + '/' + todo.id + '/' + todo.media]);
						} catch (error) {
							console.log(error);
						}
					}
					await updateTodoFieldsById(
						todo.id,
						updatedTitle,
						updatedDescription,
						updatedPriority,
						updatedMedia
					);
					loading = false;
					wantToRemoveMedia = false;
					inputFileObject = null;
				}}
			>
				{#if !hasBeenEdited}
					<p class="first-letter:capitalize">save changes</p>
				{:else if loading}
					<div class="w-6 h-6 border border-t-2 rounded-full animate-spin" />
				{:else}
					<CheckCircle />
				{/if}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
