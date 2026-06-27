<script setup>
import { Search } from '@lucide/vue'

defineProps({
  filter: {
    type: String,
    required: true
  },
  filterOptions: {
    type: Array,
    required: true
  },
  searchText: {
    type: String,
    required: true
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['update:filter', 'update:searchText'])
</script>

<template>
  <section class="toolbar">
    <label class="search-box">
      <Search :size="17" />
      <input
        :value="searchText"
        type="search"
        :placeholder="t('app.search')"
        @input="$emit('update:searchText', $event.target.value)"
      />
    </label>

    <div class="filters" role="tablist" :aria-label="t('app.filter')">
      <button
        v-for="item in filterOptions"
        :key="item.value"
        type="button"
        role="tab"
        :aria-selected="filter === item.value"
        :class="{ active: filter === item.value }"
        @click="$emit('update:filter', item.value)"
      >
        <span>{{ item.label }}</span>
        <b>{{ item.count }}</b>
      </button>
    </div>
  </section>
</template>
