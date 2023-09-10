<script>
	import ColorPalette from '$lib/components/ColorPalette.svelte';
	import KanbanColumn from '$lib/components/KanbanPage/KanbanColumn.svelte';
	import LargeSkeleton from '$lib/components/LargeSkeleton.svelte';
	import ToggleLightDarkMode from '$lib/components/ToggleLightDarkMode.svelte';
	import CardTransition from '$lib/components/animation/CardTransition.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { onMount } from 'svelte';
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

	let windowAvailable = false;

	onMount(() => {
		windowAvailable = typeof window !== 'undefined';
	});

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

{#if windowAvailable}
	<section class="bg-background">
		<nav class="flex items-center justify-between w-full gap-4 px-4 py-5 md:p-6">
			<ToggleLightDarkMode />
			{#if $userStore}
				<Button variant="default" on:click={handleSignOut}><LogOut size={22} /></Button>
			{/if}
		</nav>
		{#if loading}
			<LargeSkeleton />
		{:else if !$userStore}
			<Auth />
		{:else if $userStore}
			<CardTransition>
				<slot />
			</CardTransition>
		{/if}
	</section>
{/if}
