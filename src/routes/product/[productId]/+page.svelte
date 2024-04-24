<script>
  import { page } from "$app/stores";
  import ProdInfo from "../../../components/ProdInfo.svelte";
  const productId = $page.params.productId;
</script>

<ProdInfo {productId} />
