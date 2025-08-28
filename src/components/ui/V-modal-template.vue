<script setup lang="ts">
import { onMounted, useTemplateRef, type Ref } from 'vue'
import { dragModal } from '../../utils'

const { 
	overlay = true, 
	contentPadding = true,
	title = 'Модальное окно',
	width,
	maxHeight,
	start_top_position = 50
 } = defineProps<{
	overlay?: boolean,
	contentPadding?: boolean
	title?: string,
	width?: string,
	maxHeight?: string | number
	auto_width_close?: boolean
	different_closing_actions?: boolean
	start_top_position?: number
}>()


const state = defineModel()

const modalHeader = useTemplateRef<Ref<HTMLElement>>('modalHeader')
const dragZone = useTemplateRef<Ref<HTMLElement>>('dragZone')

const emit = defineEmits(['update:modelValue', 'close_action'])

const close_modal = () => {
	emit('close_action')
	state.value = false
}

onMounted(() => dragModal(modalHeader, dragZone, start_top_position))
</script>
<template>
	<teleport to="body">
		<div class="overlay" :style="`visibility: ${overlay ? '' : 'hidden'}`">
			<div id="modal-drag" ref="modalHeader" class="modal-dialog"
				  :style="`visibility: ${!overlay ? 'visible' : ''}; width: ${width ? width : ''}`">
				<div class="modal-dialog__header">
					<p class="modal-dialog__header-title">{{title}}</p>
					<a href="#" class="modal-dialog__header-close" @click.prevent="close_modal()">
						<ion-icon name="close-outline"></ion-icon>
					</a>
					<div id="modal-dragzone" ref="dragZone" class="modal-dialog__header-dragzone"></div>
				</div>
				<div
					class="modal-dialog__content"
					:class="{'modal-dialog__content_zero-padding': !contentPadding}"
					:style='`${maxHeight ? `max-height: ${maxHeight}px; overflow-y: auto;` : ``}`'
				>
					<slot name="content"/>
				</div>
				<div class="modal-dialog__footer">
					<slot name="buttons"/>
					<button @click="close_modal()" :style='auto_width_close ? "width: auto; padding: 0 15px;" : ""'>
						<slot name="close">Закрыть</slot>
					</button>
				</div>
			</div>
		</div>
	</teleport>
</template>
<style lang="scss">
.overlay {
	position: fixed;
	inset: 0 0 0 0;
	height: 100vh;
	width: 100%;
	z-index: 10;
	box-sizing: border-box;
}

.modal-dialog {
	z-index: 10;
	background: #bacee6;
	padding: 0 8px 8px 8px;
	box-sizing: border-box;
	position: fixed;
	min-width: 400px;
	box-shadow: rgba(17, 17, 26, 0.1) 0 4px 16px, rgba(17, 17, 26, 0.1) 0 8px 24px, rgba(17, 17, 26, 0.1) 0 16px 56px;
	&__header {
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		&-title {
			font-size: 14px;
			line-height: 30px;
		}

		&-close {
			position: absolute;
			display: flex;
			width: 40px;
			height: 25px;
			align-items: center;
			justify-content: center;
			background: #c75050;
			color: #fff;
			font-size: 20px;
			top: 0px;
			right: 9px;
			transition: 0.3s all;

			&:hover {
				background: #bd342f;
			}

			&:active {
				background: #e36571;
			}
		}

		&-dragzone {
			position: absolute;
			left: 0;
			height: 30px;
			top: 0;
			width: calc(100% - 60px);
		}
	}

	&__content {
		background: #fff;
		padding: 30px 20px;
		position: relative;
		//overflow-y: auto;
		&_zero-padding {
			padding: 0;
		}
	}

	&__footer {
		background: #f0f0f0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 15px;
		height: 50px;
		padding: 0 10px;
		box-sizing: border-box;

		button {
			border: 1px solid #a7adb3;
			padding: 0;
			background: #eeeff0;
			min-width: 95px;
			height: 30px;
			color: #333;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: 0.3s all;
			outline-offset: -4px;

			&:hover {
				border: 1px solid #92b1d6;
				outline: 1px dotted #333 !important;
				outline-offset: -4px;
				background: #fff;
			}
		}
	}

}
</style>
