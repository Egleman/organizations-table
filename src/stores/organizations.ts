import { defineStore } from "pinia"
import type { IOrganizationStore, IOrganization, IPagination } from "../types"
import { faker } from '@faker-js/faker/locale/ru'
import {STORAGE_KEY} from "../data";
import { toast } from "../utils";

// Функция для генерации данных организаций
const generateOrganizations = (): IOrganization[] => {
	const organizations: IOrganization[] = []
	const organizationTypes = ['ООО', 'ЗАО', 'ОАО', 'ИП', 'АО']
	
	for (let i = 1; i <= 100; i++) {
		const organizationType = faker.helpers.arrayElement(organizationTypes)
		const companyName = organizationType === 'ИП' 
			? `${organizationType} "${faker.person.lastName()}"`
			: `${organizationType} "${faker.company.name()}"`
		
		organizations.push({
			id: i.toString(),
			company_name: companyName,
			name: faker.person.fullName(),
			phone: `+7 (${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(2)}`
		})
	}
	
	return organizations
}

// Функция для загрузки данных из localStorage
const loadOrganizationsFromStorage = (): IOrganization[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			const parsed = JSON.parse(stored)
			// Проверяем что данные валидны и это массив
			if (Array.isArray(parsed) && parsed.length > 0) {
				return parsed
			}
		}
	} catch (error) {
		console.warn('Ошибка при загрузке данных из localStorage:', error)
	}
	
	// Если данных нет или они невалидны, генерируем новые
	const newOrganizations = generateOrganizations()
	saveOrganizationsToStorage(newOrganizations)
	return newOrganizations
}

// Функция для сохранения данных в localStorage
const saveOrganizationsToStorage = (organizations: IOrganization[]): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(organizations))
	} catch (error) {
		console.warn('Ошибка при сохранении данных в localStorage:', error)
	}
}

// Функция для инициализации данных
const initializeOrganizations = (): IOrganization[] => {
	return loadOrganizationsFromStorage()
}

export const useOrganizationsStore = defineStore('organizationsStore', {
	state: (): IOrganizationStore => {
		return {
			organizations: initializeOrganizations(),
			filtered_organizations: [],
			search_query: '',
			sort_field: null,
			sort_direction: 'asc',
			pagination: {
				page: 1,
				limit: 10,
				offset: 0,
				pages: 1,
				count: 0
			}
		}
	},

	getters: {
		sortedAndFilteredOrganizations(): IOrganization[] {
			let result = [...this.organizations]

			if (this.search_query.trim()) {
				result = result.filter(org => 
					org.name.toLowerCase().includes(this.search_query.toLowerCase())
				)
			}

			if (this.sort_field) {
				result.sort((a, b) => {
					const aValue = a[this.sort_field!].toLowerCase()
					const bValue = b[this.sort_field!].toLowerCase()
					
					if (this.sort_direction === 'asc') {
						return aValue.localeCompare(bValue)
					} else {
						return bValue.localeCompare(aValue)
					}
				})
			}

			return result
		},

		paginatedOrganizations(): IOrganization[] {
			const start = this.pagination.offset
			const end = start + this.pagination.limit
			return this.sortedAndFilteredOrganizations.slice(start, end)
		},

		currentPagination(): IPagination {
			const totalCount = this.sortedAndFilteredOrganizations.length
			const totalPages = Math.ceil(totalCount / this.pagination.limit)
			
			return {
				page: this.pagination.page,
				limit: this.pagination.limit,
				offset: this.pagination.offset,
				count: totalCount,
				pages: totalPages
			}
		}
	},

	actions: {
		addOrganization(organization: Omit<IOrganization, 'id'>) {
			const newOrganization: IOrganization = {
				...organization,
				id: Date.now().toString()
			}
			this.organizations.push(newOrganization)
			this.updatePagination()
			saveOrganizationsToStorage(this.organizations)
			toast.success('Организация успешно добавлена в конец таблицы')
		},

		removeOrganization(id: string) {
			this.organizations = this.organizations.filter(org => org.id !== id)
			this.updatePagination()

			if (this.paginatedOrganizations.length === 0 && this.pagination.page > 1) {
				this.setPage(this.pagination.page - 1)
			}

			saveOrganizationsToStorage(this.organizations)
            toast.success('Организация успешно удалена')
		},

		setSearchQuery(query: string) {
			this.search_query = query
			this.pagination.page = 1
			this.pagination.offset = 0
			this.updatePagination()
		},

		setSorting(field: 'company_name' | 'name') {
			if (this.sort_field === field) {
				this.sort_direction = this.sort_direction === 'asc' ? 'desc' : 'asc'
			} else {
				this.sort_field = field
				this.sort_direction = 'asc'
			}
		},

		setPage(page: number) {
			this.pagination.page = page
			this.pagination.offset = (page - 1) * this.pagination.limit
		},

		updatePagination() {
			const totalCount = this.sortedAndFilteredOrganizations.length
			const totalPages = Math.ceil(totalCount / this.pagination.limit)
			
			this.pagination.count = totalCount
			this.pagination.pages = totalPages
		},

		clearStorageAndRegenerate() {
			try {
				localStorage.removeItem(STORAGE_KEY)
				this.organizations = generateOrganizations()
				saveOrganizationsToStorage(this.organizations)
				this.pagination.page = 1
				this.pagination.offset = 0
				this.search_query = ''
				this.sort_field = null
				this.sort_direction = 'asc'
				this.updatePagination()
			} catch (error) {
                toast.error(`Ошибка при очистке данных: ${error}`)
			}
		}
	},
})