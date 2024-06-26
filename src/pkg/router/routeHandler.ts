import { TRequest, TResponse } from '..'
import * as fs from 'fs'
import * as path from 'path'

export async function routeHandler(
    req: TRequest,
    res: TResponse,
    filePath: string | undefined
) {
    const method = req.getMethod() ?? ''
    const routePath = path.join(`./src/${filePath}`)
    const isExist = fs.existsSync(routePath)

    if (!isExist && filePath === 'app/routes/auth/google/handler') {
        ;(await import('../auth/oauth/handler')).GET(req, res)
    } else if (!isExist && filePath === 'app/routes/auth/google/callback') {
        ;(await import('../auth/oauth/callback')).GET(req, res)
    } else if (!isExist) {
        ;(await import('../../app/routes/404/route')).GET(req, res)
    } else {
        const module = await import(path.join(`../../${filePath}`, 'route'))

        if (method !== undefined) {
            module[method]?.(req, res)
        }
    }
}
