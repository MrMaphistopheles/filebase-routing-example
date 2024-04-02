import { TRequest, TResponse } from '../../../pkg'

export function GET(req: TRequest, res: TResponse) {
    res.json({ msg: 'start route' })
}
