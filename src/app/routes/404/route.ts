import { TRequest, TResponse } from '../../../pkg'

export function GET(req: TRequest, res: TResponse) {
    res.status(404).json({ msg: '404 route' })
}
