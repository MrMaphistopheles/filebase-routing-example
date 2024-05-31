import { TRequest, TResponse } from 'src/pkg'

export function GET(req: TRequest, res: TResponse) {
    const params = req.getParams()
    const cookie = req.getCookies()
    const user = req.getUserSession()
    res.json({ params, cookie, user })
}
