<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import VInput from './components/ui/V-input.vue'
import VTable from './components/ui/V-table.vue'
import ModalCompany from './components/modals/Modal-company.vue'
import VPagination from './components/ui/V-pagination.vue'
import { useOrganizationsStore } from './stores/organizations'

const modal_company = ref(false)
const organizationsStore = useOrganizationsStore()

organizationsStore.updatePagination()

const input = ref('')


watch(input, (newValue) => {
  organizationsStore.setSearchQuery(newValue)
})

const columns = [
	{ key: 'company_name', label: 'Название', width: '30%' },
	{ key: 'name', label: 'Фио директора', width: '30%' },
  { key: 'phone', label: 'Номер телефона', width: '30%' },
  { key: 'empty', label: '', width: '10%' },
]

const handleSort = (field: 'company_name' | 'name') => {
  organizationsStore.setSorting(field)
}

const deleteOrganization = (id: string) => {
  organizationsStore.removeOrganization(id)
}

const handlePaginationClick = (page: number) => {
  organizationsStore.setPage(page)
}

const getSortIcon = (field: 'company_name' | 'name') => {
  if (organizationsStore.sort_field !== field) return '↕️'
  return organizationsStore.sort_direction === 'asc' ? '↑' : '↓'
}

const regenerateData = () => {
  if (confirm('Вы уверены, что хотите сгенерировать новые данные? Все текущие данные будут потеряны.')) {
    organizationsStore.clearStorageAndRegenerate()
  }
}

</script>

<template>
<section class="table-page">
  <div class="container">
    <div class="table-page__wrapper">
      <div class="table-page__header">
        <VInput placeholder="Найти по ФИО"  v-model="input"/>
        <div class="table-page__buttons">
          <button class="button" @click="modal_company = true">Добавить</button>
          <button class="button" @click="regenerateData">Перегенировать данные</button>
        </div>
      </div>
      <VTable
        :data="organizationsStore.paginatedOrganizations"
        :columns="columns"
      >
        <template #header-company_name>
          <span 
            @click="handleSort('company_name')" 
            class="sortable-header"
            :class="{ 'active': organizationsStore.sort_field === 'company_name' }"
          >
            Название {{ getSortIcon('company_name') }}
          </span>
        </template>
        
        <template #header-name>
          <span 
            @click="handleSort('name')" 
            class="sortable-header"
            :class="{ 'active': organizationsStore.sort_field === 'name' }"
          >
            ФИО директора {{ getSortIcon('name') }}
          </span>
        </template>
      
        <template #cell-empty="{ item }">
          <button 
            class="table-page__del"
            @click.stop="deleteOrganization(item.id)"
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </template>
      </VTable>
      <VPagination 
        :pagination="organizationsStore.currentPagination" 
        :page="organizationsStore.pagination.page"
        @pagination_clicked="handlePaginationClick"
      />
    </div>
  </div>
</section>
<ModalCompany v-if="modal_company" v-model="modal_company"/>
</template>

<style lang="scss" scoped>
.sortable-header {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    opacity: 0.8;
  }
  
  &.active {
    font-weight: 700;
  }
}
</style>
