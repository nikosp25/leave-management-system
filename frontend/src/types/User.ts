export type CurrentUser = {
    uuid: string
    firstName: string
    lastName: string
    email: string
    roleName: string
    availableLeaveDays: number
    deleted: boolean
}