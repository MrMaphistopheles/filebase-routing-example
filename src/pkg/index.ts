import * as http from 'http'
import { middlewareHandler } from './middleware/middleware'
import { routeHandler } from './router/routeHandler'
import { json } from './method/json'
import { html } from './method/html'

class RouterResponse {
    private response: http.ServerResponse

    constructor(response: http.ServerResponse) {
        this.response = response
    }

    json(data: any) {
        this.response.statusCode = 200
        json.json(data, this.response)
    }

    html(data: string) {
        html.html(data, this.response)
    }

    status(statusCode: number) {
        this.response.statusCode = statusCode

        return {
            html: (data: string) => {
                html.html(data, this.response)
            },
            json: (obj: unknown) => {
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
