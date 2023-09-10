<script>
	/**
	 * @type {string} text
	 */

	export let text;
	/**
	 * @type {string} backgroundColor
	 */
	export let backgroundColor = '';
</script>

<div id="seperator" class="relative flex mb-5 font-light uppercase mt-28">
	<div class="absolute inset-0 flex items-center">
		<span class="w-[80%] border-t border-gray-600 block mx-auto" />
	</div>
	<h3 class="relative block px-4 mx-auto bg-background {backgroundColor}">{text}</h3>
</div>
