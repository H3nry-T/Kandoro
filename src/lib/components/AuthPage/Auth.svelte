<script>
	import { supabase } from '../../supabase';
	import GoogleIcon from '$lib/components/AuthPage/GoogleIcon.svelte';
	import SeperatorWithText from './SeparatorWithText.svelte';
	import TermsAndConditions from './TermsAndConditions.svelte';
	import AuthHero from './AuthHero.svelte';
	import InputFancy from '../InputFancy.svelte';

	let PUBLIC_PRODUCTION_DOMAIN = 'https://kandoro-board.vercel.app';
	let PUBLIC_TESTING_DOMAIN = 'http://localhost:5173';
	let loading = false;

	let email = '';

	async function handleMagicLinkLogin() {
		loading = true;
		try {
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					emailRedirectTo:
						process.env.NODE_ENV === 'production' ? PUBLIC_PRODUCTION_DOMAIN : PUBLIC_TESTING_DOMAIN
				}
			});
			if (error) throw error;

			alert(`please check your email inbox at ${email}`);
		} catch (/** @type {any} error*/ error) {
			console.error(error);
			alert(`error : ${error.message}`);
		} finally {
			loading = false;
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo:
						process.env.NODE_ENV === 'production' ? PUBLIC_PRODUCTION_DOMAIN : PUBLIC_TESTING_DOMAIN
				}
			});

			if (error) throw error;
		} catch (/** @type {any} error */ error) {
			console.error(error);
			alert(`this is the error ${error.message}`);
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex flex-col justify-center min-h-screen">
	<AuthHero />

	<form on:submit|preventDefault={handleMagicLinkLogin} class="w-full max-w-3xl p-4 mx-auto mt-5">
		<InputFancy
			placeholderFancy="johnDoe@email.com"
			labelFancy="email:"
			classLabel="font-base tracking-wide text-base capitalize"
			className="mt-20"
			type="email"
			id="email"
			required
			bind:value={email}
			placeholder="email"
		/>
		<button
			type="submit"
			class="group max-w-md mx-auto w-full flex justify-center px-3 py-2 mt-4 text-gray-100 rounded capitalize items-center divide-x divide-gray-100 hover:bg-gray-700 active:bg-gray-950 {loading
				? 'bg-muted-foreground'
				: 'bg-gray-800'} "
			disabled={loading ? true : false}
		>
			<span class="block transition-all duration-75 ease-linear scale-125 group-hover:scale-150"
				>&rarr;</span
			>
			<span
				class="block pl-4 ml-4 leading-none transition-all duration-75 ease-linear group-hover:leading-5 group-hover:text-transparent from-blue-500 to-orange-500 bg-clip-text bg-gradient-to-r group-hover:font-semibold"
				>sign-in</span
			>
		</button>
	</form>

	<div class="py-10">
		<SeperatorWithText text="or continue with" />
	</div>

	<button
		type="button"
		class=" px-3 py-2 mx-auto mt-1 text-gray-100 rounded capitalize flex items-center divide-x divide-gray-100 hover:bg-gray-700 active:bg-gray-950 {loading
			? 'bg-muted-foreground'
			: 'bg-gray-800'} "
		disabled={loading ? true : false}
		on:click={handleGoogleLogin}
		><GoogleIcon width={20} height={20} /><span class="pl-4 ml-4 leading-none">
			google</span
		></button
	>

	<TermsAndConditions />
</section>
