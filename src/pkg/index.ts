import * as http from 'http'
import { middlewareHandler } from './middleware/middleware'
import { routeHandler } from './router/routeHandler'
import { json } from './method/json'
import { html } from './method/html'
import { Cookie, cookies } from './method/set-cookies'
import { type JwtPayload, verify } from 'jsonwebtoken'
import dotenv from 'dotenv'

interface User {
    id: string
    name: string
    given_name: string
    family_name: string
    picture: string
    locale: string
}

interface UserToken {
    user: User
    iat: number
    exp: number
}

dotenv.config()

class RouterResponse {
    private response: http.ServerResponse

    constructor(response: http.ServerResponse) {
        this.response = response
    }

    json(data: any) {
        this.response.setHeader('Content-Type', 'application/json')
        this.response.statusCode = 200
        json.json(data, this.response)
    }

    setCookie(cookie: Cookie) {
        cookies.set(cookie, this.response)
    }

    html(data: string) {
        this.response.statusCode = 200
        this.response.setHeader('Content-Type', 'text/html')
        html.html(data, this.response)
    }

    end() {
        this.response.end()
    }

    status(statusCode: number) {
        return {
            html: (data: string) => {
                this.response.statusCode = statusCode
                this.response.setHeader('Content-Type', 'text/html')
                html.html(data, this.response)
            },
            json: (obj: unknown) => {
                this.response.statusCode = statusCode
                this.response.setHeader('Content-Type', 'application/json')
                json.json(obj, this.response)
            },
        }
    }

    redirect(url: string) {
        this.response
            .writeHead(301, {
                location: url,
            })
            .end()
    }
}

class RouterRequest {
    private request: http.IncomingMessage

    constructor(request: http.IncomingMessage) {
        this.request = request
    }

    async body() {
        async function getBuffer(self: any) {
            return new Promise<Buffer>((resolve) => {
                self.on('data', (chunk: Buffer | string) => {
                    if (Buffer.isBuffer(chunk)) {
                        resolve(chunk)
                    }
                    if (chunk === typeof 'string') {
                        const buffer = new Buffer(chunk)

                        resolve(buffer)
                    }
                })
            })
        }

        async function getBody(self: any, buffer: Buffer) {
            return new Promise<string>((resolve) => {
                self.on('end', () => {
                    const body = buffer.toString()
                    const json = JSON.parse(body)
                    resolve(json)
                })
            })
        }

        const buffer = await getBuffer(this.request)
        const body = await getBody(this.request, buffer)

        return body
    }

    getUrl() {
        return this.request.url
    }
    getMethod() {
        return this.request.method
    }

    getCurrentPage() {
        return this.request.url?.split('?')[0]?.split('/').splice(-1)[0]
    }

    /**
     * Retrieves the cookies from the request headers.
     *
     * @returns {Object} - The cookie object containing the name and value.
     */
    getCookies(): { name: string | undefined; value: string | undefined } {
        // Retrieve the full cookie string from the request headers
        const fullCookie = this.request.headers.cookie

        // Split the cookie string by '=' to separate the name and value
        const arrayWithCookies = fullCookie?.split('=')

        // Create a cookie object with the name and value
        const cookie = {
            name: arrayWithCookies?.[0], // The name of the cookie
            value: arrayWithCookies?.[1], // The value of the cookie
        }

        return cookie
    }

    /**
     * Retrieves the user session from the cookies.
     *
     * @returns {Object | undefined} - The decoded user session object, or undefined if the session is not found.
     */
    getUserSession(): UserToken | undefined {
        // Get the value of the session cookie
        const { value } = this.getCookies()

        // If the session is not found, return undefined
        if (!value) return undefined

        // Decode the session value using the secret key
        const decoded = verify(value, process.env.SECRET as string)

        const user: UserToken = JSON.parse(JSON.stringify(decoded))

        // Return the decoded session object
        return user
    }

    getParams() {
        const arrWithParams = this?.request?.url
            ?.split('?')
            ?.splice(1)[0]
            ?.split('&')

        if (!arrWithParams) return undefined

        const params = arrWithParams?.map((i) => {
            const split = i.split('=')
            const key = split[0]?.toString() ?? ''

            return {
                [key]: split[1],
            }
        })

        return params
    }
}

export type TResponse = RouterResponse
export type TRequest = RouterRequest

const BASE_FILE_PATH = 'app/routes'

export function start(port: number) {
    const server = http.createServer(async (req, res) => {
        const response = new RouterResponse(res)
        const request = new RouterRequest(req)

        const url = request.getUrl()
        const filePath = `${BASE_FILE_PATH}/${url}`
            .replace('//', '/')
            .split('?')[0]

        try {
            await middlewareHandler(request, response, async () => {
                await routeHandler(request, response, filePath)
            })
        } catch (error) {
            console.error('Error occurred:', error)
            response.status(500).html('Internal Server Error')
        }
    })

    server.listen(port, () => {
        console.log(`server listen on port ${port}`)
    })
}
