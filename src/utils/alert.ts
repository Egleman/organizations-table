import {useToast} from "vue-toastification";
export const toast = {
	success: function (message: string) {
		useToast().success(message)
	},
	warning: function (message: string) {
		useToast().warning(message)
	},
	error: function (message: string) {
		useToast().error(message)
	}
}
