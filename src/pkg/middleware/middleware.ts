import { TRequest, TResponse } from '..'

export async function middlewareHandler(
    req: TRequest,
    res: TResponse,
    next: () => Promise<void>
) {
    const { middleware, confige } = await import(
        '../../app/middleware/middleware'
    )

    const fileName = req.getUrl()?.split('?')[0]?.split('/').splice(-1)[0] ?? ''

    const matcher = confige.matcher.map((i) => {
        return i.split('/')[1]
    })

    if (matcher.includes(fileName)) {
        middleware(req, res, next)
    } else [next()]

    if (matcher.length === 0) {
        middleware(req, res, next)
    }
}
