<script>
	import { Badge } from '$lib/components/ui/badge/index';
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Checkbox } from '$lib/components/ui/checkbox/index';
	import {
		animateAddCard,
		animateFinalizeCard,
		finalizingCard
	} from '$lib/stores/cardAnimationStore';
	import { deleteTodos, updateToggleTodos } from '$lib/stores/todosStore';
	import { FileEdit, X } from 'lucide-svelte';

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
	class="min-w-fit  transition-all duration-300 ease-in-out 
	{animateToggle ? 'border-accent-foreground' : null}
	{$animateAddCard && isLast ? 'border-accent-foreground' : null}
	{$animateFinalizeCard && todo.id === $finalizingCard ? 'border-accent-foreground' : null}
	"
>
	<section class="flex">
		<header class="w-full pt-1 pl-1 pr-1">
			<div class="flex items-center justify-between">
				<h4
					class="pl-1 text-base md:text-sm font-semibold md:w-[14vw] lg:w-[17vw] lg:text-lg transition-colors duration-1000 ease-linear truncate first-letter:capitalize {todo.is_done
						? 'line-through text-muted-foreground'
						: ''}"
				>
					{todo.title}
				</h4>
				<section class="flex items-center gap-1">
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Checkbox
								checked={todo.is_done}
								onCheckedChange={() => {
									updateToggleTodos(todo.id, todo.is_done);
									playAnimation();
								}}
								class="grid self-center w-5 h-5 border place-items-center"
							/>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p class="first-letter:capitalize">mark is done</p>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root>
						<Tooltip.Trigger
							><Button
								class="p-0 h-[25px] w-[25px] leading-none border bg-card group hover:bg-gray-400/10"
								size="icon"
								variant="secondary"
								><FileEdit
									size={20}
									class="transition-all duration-300 ease-in-out group-hover:text-gray-400"
								/></Button
							></Tooltip.Trigger
						>
						<Tooltip.Content>
							<p class="first-letter:capitalize">edit todo</p>
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger
							><Button
								variant="destructive"
								size="icon"
								class="p-0 border group h-[25px] w-[25px] bg-card hover:bg-red-100"
								on:click={() => deleteTodos(todo.id)}
								><X
									class="transition-all duration-300 ease-in-out text-primary group-hover:text-red-900"
								/>
							</Button></Tooltip.Trigger
						>
						<Tooltip.Content>
							<p>Delete todo</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</section>
			</div>
			{#if todo.description.length > 0}
				<Card.Description class="truncate">{todo.description}</Card.Description>
			{/if}
		</header>
	</section>
	<Card.Footer class="flex items-center px-2 py-2">
		<div class="">
			{#if todo.column_number === 1}
				<Badge class="text-blue-800 bg-blue-300 pointer-events-none " variant="outline"
					>ice-box</Badge
				>
			{:else if todo.column_number === 2}
				<Badge class="text-yellow-800 bg-yellow-300 pointer-events-none" variant="secondary"
					>in-progress</Badge
				>
			{:else}
				<Badge class="text-green-800 bg-green-300 pointer-events-none">done</Badge>
			{/if}
		</div>
	</Card.Footer>
</Card.Root>
