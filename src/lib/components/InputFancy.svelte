<script>
	import Input from './ui/input/input.svelte';

	/**
	 * @type {import("svelte/elements").HTMLInputAttributes["class"]} className
	 */

	export let className = '';

	/**
	 * @type {import("svelte/elements").HTMLInputAttributes["value"]} value
	 */
	export let value = undefined;

	/**
	 * @type {import("svelte/elements").HTMLLabelAttributes["class"]} classLabel
	 */
	export let classLabel;

	/**
	 * @type {string} placeholderFancy
	 */
	export let placeholderFancy;
	/**
	 * @type {string} labelFancy
	 */
	export let labelFancy;
</script>

<fieldset class="relative block max-w-md mx-auto mt-10 {className}">
	<Input
		class="w-full px-2 py-1 mt-5 text-base border border-gray-300 rounded-lg shadow-sm placeholder:text-transparent peer placeholder-shown:mt-0"
		bind:value
		{...$$restProps}
	/>
	<label
		for="email"
		class="block cursor-text font-base text-transparent absolute top-[-25px] left-[7px] peer-placeholder-shown:top-[8px] peer-placeholder-shown:left-[10px] peer-placeholder-shown:text-muted-foreground transition-all duration-75 ease-linear"
		>{placeholderFancy}</label
	>
	<label
		for="email"
		class="block font-semibold text-lg pointer-events-none peer-placeholder-shown:text-transparent text-foreground absolute top-[-10px] left-[7px] peer-placeholder-shown:top-[5px] peer-placeholder-shown:left-[9px] peer-placeholder-shown:text-gray-500 transition-all duration-75 ease-linear {classLabel}"
		>{labelFancy}</label
	>
</fieldset>
