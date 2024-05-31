import * as http from 'http'

export interface Cookie {
    name: string
    value: string
    httpOnly?: boolean
    secure?: boolean
    maxAge?: number
    sameSite?: 'strict' | 'lax' | 'none'
    partionKey?: boolean
    priority?: 'low' | 'medium' | 'high' | 'auto'
    path?: string
}
export const cookies = {
    /**
     * Sets a cookie on the response object
     *
     * @param {Cookie} cookie - The cookie object
     * @param {http.ServerResponse} res - The response object
     */
    set: (cookie: Cookie, res: http.ServerResponse) => {
        // Extract the cookie properties
        const {
            name,
            value,
            httpOnly,
            secure,
            maxAge,
            sameSite,
            partionKey,
            priority,
            path,
        } = cookie

        // Set the status code to 200
        res.statusCode = 200

        // Set the 'Set-Cookie' header with the cookie properties
        res.setHeader(
            'Set-Cookie',
            `${name}=${value}; HttpOnly=${httpOnly}; Secure=${secure}; Max-Age=${maxAge}; SameSite=${sameSite}; Path=${path}; ${partionKey && 'Partitioned;'} Priority=${priority}`
        )
    },
}
