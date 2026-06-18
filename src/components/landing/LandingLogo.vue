<script setup lang="ts">
import logoUrl from '@/assets/logo/logo.png'

withDefaults(
  defineProps<{
    variant?: 'navbar' | 'footer'
  }>(),
  { variant: 'navbar' },
)
</script>

<template>
  <img
    :src="logoUrl"
    alt="Glow Up Connect"
    :class="[
      'object-contain object-left',
      variant === 'navbar' ? 'h-11 w-auto sm:h-12' : 'h-14 w-auto',
    ]"
  />
</template>
