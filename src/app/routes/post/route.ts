import { TRequest, TResponse } from 'src/pkg'

export async function POST(req: TRequest, res: TResponse) {
    const body = await req.body()

    res.status(200).json({ body })
}
