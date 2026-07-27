export const SESSION_EXPIRED_EVENT =
    'session-expired'

export class SessionExpiredError extends Error {
    constructor() {
        super('Your session has expired.')
        this.name = 'SessionExpiredError'
    }
}

export async function apiFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    const response = await fetch(input, {
        ...init,
        credentials: 'include',
    })

    if (response.status === 401) {
        window.dispatchEvent(
            new Event(SESSION_EXPIRED_EVENT),
        )

        throw new SessionExpiredError()
    }

    return response
}