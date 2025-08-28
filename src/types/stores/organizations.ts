export interface IOrganization {
    id: string
    company_name: string
    name: string
    phone: string
}

export interface IOrganizationStore {
    organizations: IOrganization[]
    filtered_organizations: IOrganization[]
    search_query: string
    sort_field: 'company_name' | 'name' | null
    sort_direction: 'asc' | 'desc'
    pagination: {
        page: number
        limit: number
        offset: number
        pages: number
        count: number
    }
}