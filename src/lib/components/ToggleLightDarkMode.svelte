<script lang="js">
	import { Moon, Sun } from 'lucide-svelte';
	import Toggle from './ui/toggle/toggle.svelte';

	let isDark = false;
	function handleIsDark() {
		isDark = !isDark;
		document.body.classList.toggle('dark', isDark);
	}
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		isDark = true;
		document.body.classList.add('dark');
	}
</script>

<Toggle pressed={isDark} on:click={handleIsDark} class="border">
	{#if isDark}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Toggle>
