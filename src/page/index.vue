<template>
  <div class="page">
    <div class="container" ref="container"></div>
  </div>
</template>

<script lang="ts" setup>
import { useThreeJs } from "@/hooks/threejs.hooks";

const { container } = useThreeJs();
</script>

<style lang="less">
.page {
  width: 100%;
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
  }
}
</style>
