<script>
	import ColorPalette from '$lib/components/ColorPalette.svelte';
	import KanbanColumn from '$lib/components/KanbanPage/KanbanColumn.svelte';
	import ToggleLightDarkMode from '$lib/components/ToggleLightDarkMode.svelte';
	import CardTransition from '$lib/components/animation/CardTransition.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import '../app.css';
	import Auth from '../lib/components/AuthPage/Auth.svelte';
	import { userStore } from '../lib/stores/authStore';
	import { loadTodos, todos } from '../lib/stores/todosStore';
	import { supabase } from '../lib/supabase';

	import { LogOut } from 'lucide-svelte';

	let loading = false;

	async function handleSignOut() {
		const { error } = await supabase.auth.signOut();
		userStore.set(null);
	}

	async function loadUser() {
		try {
			loading = true;
			const response = await supabase.auth.getUser();
			const supabaseUser = response.data.user;
			if (supabaseUser) {
				userStore.set(supabaseUser);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}

	supabase.auth.onAuthStateChange((event, session) => {
		if (session?.user) {
			console.log(event, session);
			userStore.set(session?.user);

			loadTodos();
		}
	});

	loadUser();
</script>

<section>
	{#if !loading}
		<nav class="flex items-center justify-between w-full gap-4 px-4 py-5 md:p-6">
			<ToggleLightDarkMode />
			{#if $userStore}
				<Button variant="default" on:click={handleSignOut}><LogOut size={22} /></Button>
			{/if}
		</nav>
		{#if !$userStore}
			<Auth />
		{:else}
			<CardTransition>
				<slot />
			</CardTransition>
		{/if}
	{:else}
		<section class="flex flex-col items-center min-w-full min-h-screen gap-20 py-20 bg-background">
			<Skeleton class="w-[90%] h-[100px] rounded-lg" />

			<section class="grid w-full max-w-lg grid-cols-1 md:grid-cols-3 md:max-w-7xl gap-96">
				<section class="flex flex-col self-center gap-20 justify-self-center">
					{#each new Array(5).fill(0) as _, i (i)}
						<div class="flex items-center gap-4">
							<Skeleton class="w-12 h-12 rounded-full" />
							<div class="space-y-2">
								<Skeleton class="h-4 w-[250px]" />
								<Skeleton class="h-4 w-[200px]" />
							</div>
						</div>
					{/each}
				</section>
				<section class="flex-col self-center hidden gap-20 justify-self-center md:flex">
					{#each new Array(5).fill(0) as _, i (i)}
						<div class="flex items-center gap-4">
							<Skeleton class="w-12 h-12 rounded-full" />
							<div class="space-y-2">
								<Skeleton class="h-4 w-[250px]" />
								<Skeleton class="h-4 w-[200px]" />
							</div>
						</div>
					{/each}
				</section>
				<section class="flex-col self-center hidden gap-20 justify-self-center md:flex">
					{#each new Array(5).fill(0) as _, i (i)}
						<div class="flex items-center gap-4">
							<Skeleton class="w-12 h-12 rounded-full" />
							<div class="space-y-2">
								<Skeleton class="h-4 w-[250px]" />
								<Skeleton class="h-4 w-[200px]" />
							</div>
						</div>
					{/each}
				</section>
			</section>
		</section>
	{/if}
</section>
