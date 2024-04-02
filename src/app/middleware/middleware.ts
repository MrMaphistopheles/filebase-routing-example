import { TRequest, TResponse } from 'src/pkg'

export function middleware(
    req: TRequest,
    res: TResponse,
    next: () => Promise<void>
) {
    console.log(
        `Hi there, I'm middleware and 
        i will be executed only for route that defined in confige obj, 
        if you leave confige empty I'll execute for every route in your application`
    )

    const currentPage = req.getCurrentPage()

    if (currentPage === 'start') {
        res.redirect('http://localhost:3000/params?id=1')
    } else {
        next()
    }
}

export const confige = {
    matcher: ['/start', '/'],
}
