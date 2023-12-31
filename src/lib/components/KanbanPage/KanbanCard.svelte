<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	import { Badge } from '$lib/components/ui/badge/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Label } from '$lib/components/ui/label/index';
	import { Checkbox } from '$lib/components/ui/checkbox/index';
	import {
		animateAddCard,
		animateFinalizeCard,
		finalizingCard
	} from '$lib/stores/cardAnimationStore';
	import { deleteTodos, updateTodoFieldsById, updateToggleTodos } from '$lib/stores/todosStore';
	import { CheckCircle, File, FileEdit, X } from 'lucide-svelte';
	import Input from '../ui/input/input.svelte';
	import KanbanDialog from './KanbanDialog.svelte';
	import { userStore } from '$lib/stores/authStore';
	import { supabase } from '$lib/supabase';

	/**
	 * @type {import('$lib/stores/todosStore').Todo} todo
	 */
	export let todo;

	export let isLast = false;

	let animateToggle = false;
	function playAnimation(duration = 500) {
		animateToggle = true;
		const clearTimeout = setTimeout(() => {
			animateToggle = false;
		}, duration);
	}
</script>

<Card.Root
	class="transition-all duration-300 ease-in-out 
	{animateToggle ? 'border-accent-foreground' : null}
	{$animateAddCard && isLast ? 'border-accent-foreground' : null}
	{$animateFinalizeCard && todo.id === $finalizingCard ? 'border-accent-foreground' : null}
	"
>
	<section class="flex">
		<header class="w-full pt-1 pl-1 pr-1">
			<div class="flex items-center justify-between">
				<h4
					class="pl-1 text-sm mr-2 sm:mr-1 sm:text-base w-[70vw] md:text-sm font-semibold md:w-[14vw] lg:w-[17vw] lg:text-lg transition-colors duration-1000 ease-linear truncate first-letter:capitalize {todo.is_done
						? 'line-through text-muted-foreground'
						: ''}"
				>
					{todo.title}
				</h4>
				<section class="flex items-center gap-1">
					<Tooltip.Root>
						<Tooltip.Trigger class="grid place-items-center">
							<Checkbox
								checked={todo.is_done}
								onCheckedChange={() => {
									updateToggleTodos(todo.id, todo.is_done);
									playAnimation();
								}}
								class="grid self-center w-[21px] h-[21px] border place-items-center"
							/>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p class="first-letter:capitalize">mark is done</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root>
						<Tooltip.Trigger class="grid place-items-center">
							<KanbanDialog {todo} />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p class="first-letter:capitalize">edit todo</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root>
						<Tooltip.Trigger class="grid place-items-center">
							<AlertDialog.Root>
								<AlertDialog.Trigger
									class="grid p-0 transition-all duration-300 ease-in-out border rounded-md hover:brightness-75 place-items-center bg-card"
								>
									<X
										class="transition-all duration-300 ease-in-out text-primary group-hover:text-red-900 "
										size={22}
									/>
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your todo and
											remove your data from our servers.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											on:click={async () => {
												const { data, error } = await supabase.storage
													.from('images')
													.remove([$userStore?.id + '/' + todo.id + '/' + todo.media]);
												if (error) console.log(error);
												await deleteTodos(todo.id);
											}}>Delete</AlertDialog.Action
										>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Delete todo</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</section>
			</div>
			{#if todo.description.length > 0}
				<Card.Description class="pl-1 truncate first-letter:capitalize w-[50vw] md:w-[20vw]"
					>{todo.description}</Card.Description
				>
			{/if}
		</header>
	</section>
	<Card.Footer class="flex items-center w-full gap-1 px-2 py-2">
		{#if todo.column_number === 1}
			<Badge class="" variant="secondary">ice-box</Badge>
		{:else if todo.column_number === 2}
			<Badge class="" variant="secondary">in-progress</Badge>
		{:else}
			<Badge class="" variant="secondary">done</Badge>
		{/if}
		{#if todo.tags}
			<Badge
				class={`pointer-events-none ${
					todo.tags.tag_name === 'high'
						? 'bg-red-900 text-red-200'
						: todo.tags.tag_name === 'medium'
						? 'bg-yellow-900 text-yellow-200'
						: todo.tags.tag_name === 'low'
						? 'bg-green-900 text-green-200'
						: ''
				}`}>{todo.tags.tag_name}</Badge
			>
		{/if}
		{#if todo.media}
			<Badge class="ml-auto" variant="default"><File size={16} /></Badge>
		{/if}
	</Card.Footer>
</Card.Root>
