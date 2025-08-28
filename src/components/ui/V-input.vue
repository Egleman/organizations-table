<script setup lang="ts">
const {
  placeholder = '',
  centered_placeholder = false,
  debounce = false,
  mask = '',
  disabled = false,
  type = 'text',
  maxLength
} = defineProps<{
  placeholder?: string,
  centered_placeholder?: boolean,
  debounce?: boolean,
  mask?: string,
  disabled?: boolean,
  maxLength?: number | string,
  type?: string,
}>()

const emit = defineEmits(['set_debounce'])

const model = defineModel({default: ''})

const set_debounce = () => {
	if (debounce) {
		emit('set_debounce')
	}
}

</script>
<template>
	<div class="v-input">
		<input
			v-debounce:500="set_debounce"
			v-model="model"
			v-mask='mask'
			:type="type"
			:maxlength='maxLength ? maxLength : ""'
			:placeholder="placeholder"
			:class='{"centered": centered_placeholder}'
      :disabled="disabled"
		/>
	</div>
</template>
<style lang='scss' scoped>
.v-input {
	display: flex;
	width: 100%;
	height: 36px;
	box-sizing: border-box;
	position: relative;
	input {
		background: #fff;
		font-size: 14px;
		line-height: normal;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 0 30px 0 15px;
		outline: none !important;
		z-index: 1;
		position: relative;
    border: 1px solid #bfbfbf;
		&::placeholder {
			font-size: 14px;
			color: #818c99;
		}
	}
	input.centered {
		&::placeholder {
			text-align: center;
		}
	}
}
</style>
