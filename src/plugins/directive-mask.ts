import Inputmask from "inputmask";
import type { DirectiveBinding } from 'vue';

export const vMask = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		if (Boolean(binding.value)) {
			const im = new Inputmask({
				mask: binding.value,
				showMaskOnHover: false,
				showMaskOnFocus: false,
				jitMasking: true,
				inputmode: 'tel'
			})
			im.mask(el)
		}
	},
	unmounted(el) {
		Inputmask.remove(el)
	}
}