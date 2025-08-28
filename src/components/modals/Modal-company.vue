<script setup lang="ts">
import { ref, computed } from 'vue'
import VModalTemplate from '../ui/V-modal-template.vue'
import VInput from '../ui/V-input.vue'
import { useOrganizationsStore } from '../../stores/organizations'

const state = defineModel()
const organizationsStore = useOrganizationsStore()

const form = ref({
    company_name: '',
    phone: '',
    director_name: ''
})

const isFormValid = computed(() => {
    return form.value.company_name.trim() !== '' && 
           form.value.phone.trim() !== '' && 
           form.value.director_name.trim() !== ''
})

const add_company = () => {
    if (isFormValid.value) {
        organizationsStore.addOrganization({
            company_name: form.value.company_name,
            name: form.value.director_name,
            phone: form.value.phone
        })
      
        form.value = {
            company_name: '',
            phone: '',
            director_name: ''
        }
        state.value = false
    }
}

</script>
<template>
    <VModalTemplate
		v-if="state"
		v-model="state"
		title="Добавить организацию"
	>
        <template #content>
            <div class="modal-company">
                <VInput placeholder="Название организации" v-model="form.company_name"/>
                <VInput placeholder="Номер телефона" mask="(+7|8) (999) 999-99-99" v-model="form.phone"/>
                <VInput placeholder="ФИО директора" v-model="form.director_name"/>
            </div>
        </template>
        <template #buttons>
            <button 
                @click="add_company" 
                :disabled="!isFormValid"
                :class="{ '--disabled': !isFormValid }"
            >
                Добавить
            </button>
        </template>
    </VModalTemplate>
</template>
<style lang="scss" scoped>
.modal-company {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

button.--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
</style>