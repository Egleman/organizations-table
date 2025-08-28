<script setup lang="ts">
import { computed } from 'vue'
import type {IPagination} from "../../types";

const { pagination, page } = defineProps<{
  pagination: IPagination
  page: number
}>()

const emit = defineEmits(['pagination_clicked'])

const pagination_numbers = computed((): { before: number[]; after: number[] } => {
	let result: { before: number[]; after: number[] } = {
		before: [],
		after: [],
	}

	const current_page: number = page
	const last_page: number = pagination.pages

	if (current_page !== 1) {
		result.before.push(1)
	}
	if (current_page - 1 > 1) {
		result.before.push(current_page - 1)
	}

	result.before.push(current_page)

	if (current_page + 1 < last_page) {
		result.before.push(current_page + 1)
	}

	if (current_page + 2 < last_page) {
		result.before.push(current_page + 2)
	}

	if (current_page !== last_page) {
		if (!result.before.includes(last_page - 1)) {
			result.after.push(last_page - 1)
		}
		result.after.push(last_page)
	}

	return result
})
</script>

<template>
	<div class="pagination">
		<div
			v-for="(page_number, index) in pagination_numbers.before"
			class="pagination__item"
			:class="{ '--active': page === page_number }"
			@click="$emit('pagination_clicked', page_number)"
			:key="index"
		>
			{{ page_number }}
		</div>
		<div
			v-for="(page_number, index) in pagination_numbers.after"
			class="pagination__item"
			@click="$emit('pagination_clicked', page_number)"
			:key="index"
		>
			{{ page_number }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.pagination {
	margin-top: 15px;
	width: 100%;
	display: flex;
	justify-content: center;
	gap: 5px;
	&__item {
		min-width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: 1px solid #b6b6b6;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 400;
		font-size: 14px;
		color: #000;
		&.--active {
			background: #2c2438;
			color: #fff;
			border-color: #2c2438;
		}
	}
}
</style>
