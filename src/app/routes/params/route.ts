import { TRequest, TResponse } from 'src/pkg'

export function GET(req: TRequest, res: TResponse) {
    const params = req.getParams()
    res.json({ params })
}
