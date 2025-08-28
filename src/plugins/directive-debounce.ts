import type { DirectiveBinding } from 'vue';
import { debounce } from "../utils";

export const vDebounce = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		const handleInput = () => {
			binding.value()
		}
		const debouncedHandle = debounce(handleInput, Number(binding.arg))
		el.addEventListener('input', debouncedHandle)
	},
}
