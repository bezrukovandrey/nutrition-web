<script>
  import Navbar from "../components/Navbar.svelte";
  import Footer from "../components/Footer.svelte";
  import "../app.css";
  import { SvelteToast } from '@zerodevx/svelte-toast'

  export let title = "wisenourish";
</script>

<div>
  <Navbar />
  <slot />
  <Footer />
</div>

<head>
  <title>{title}</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Bitter:wght@700&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
    rel="stylesheet"
  />
</head>
<SvelteToast />