export type CurrentUser = {
    uuid: string
    firstName: string
    lastName: string
    email: string
    roleName: string
    capabilities: string[]
    availableLeaveDays: number
    deleted: boolean
}