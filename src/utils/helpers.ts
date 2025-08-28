import type { Ref } from 'vue';

export const debounce = (func: (...args: any[]) => any, ms: number) => {
    let timeout: number;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), ms);
    };
}

export const dragModal = (modal_header: Ref<HTMLElement>, drag_zone: Ref<HTMLElement>, start_top_position?: number) => {
	const divWidth = modal_header.value.clientWidth
	const bodyWidth = document.body.clientWidth
	const left = (bodyWidth - divWidth) / 2
	const top = start_top_position ? start_top_position : 50
	modal_header.value.style.left = left + "px";
	modal_header.value.style.top = top + "px";
	const listener = (e: MouseEvent) => {
		modal_header.value.style.left = e.clientX - divWidth / 2 + 'px';
		modal_header.value.style.top = e.clientY - 10 + 'px';
	};
	drag_zone.value.addEventListener('mousedown', (e) => {
		document.addEventListener('mousemove', listener);
	});
	drag_zone.value.addEventListener('mouseup', (e) => {
		document.removeEventListener('mousemove', listener);
	});
};