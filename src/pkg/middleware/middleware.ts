import { log } from 'console'
import { TRequest, TResponse } from '..'

/**
 * Middleware handler function that handles incoming requests and executes middleware functions if the requested file matches the confige matcher.
 * If the confige matcher is empty, the middleware function will execute for every route in the application.
 *
 * @param {TRequest} req - The incoming request object
 * @param {TResponse} res - The outgoing response object
 * @param {() => Promise<void>} next - The next middleware function in the chain
 */
export async function middlewareHandler(
    req: TRequest,
    res: TResponse,
    next: () => Promise<void>
) {
    // Import middleware and confige objects from the app/middleware/middleware file
    const { middleware, confige } = await import(
        '../../app/middleware/middleware'
    )

    // Extract the file name from the requested URL
    const fileName = req.getUrl()?.split('?')[0]?.split('/').splice(-1)[0] ?? ''

    // Extract the first part of each matcher (e.g. '/start' -> 'start')
    const matcher = confige.matcher.map((i) => {
        return i.split('/')[1]
    })

    const authMatcher = confige.authMatcher.map((i) => {
        return i.split('/')[1]
    })
    // If the requested file matches the auth matcher
    if (authMatcher.includes(fileName)) {
        const isAuth = req.getUserSession()

        if (!isAuth) {
            res.redirect('/auth/google')
        }
        middleware(req, res, next)
    }

    // If the requested file matches any of the matcher files, execute the middleware function
    else if (matcher.includes(fileName)) {
        middleware(req, res, next)
    }
    // If the matcher is empty, execute the middleware function for every route in the application
    else if (matcher.length === 0) {
        middleware(req, res, next)
    }
    // If the requested file does not match any of the matcher files, execute the next middleware function in the chain
    else {
        next()
    }
}
