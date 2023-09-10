<script>
	import Skeleton from './ui/skeleton/skeleton.svelte';
</script>

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
