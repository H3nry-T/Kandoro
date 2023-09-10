<script>
	import { fade, fly } from 'svelte/transition';

	export let animateAddCard = false;

	/**
	 * @type {boolean} animate
	 */
	let animate = false;
	setTimeout(() => {
		animate = true;
	}, 1);
</script>

{#if animate || animateAddCard}
	<div in:fly={{ y: 10 }} out:fade>
		<slot />
	</div>
{/if}
