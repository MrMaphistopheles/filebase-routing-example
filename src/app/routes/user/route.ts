import { log } from 'console'
import { TRequest, TResponse } from '../../../pkg'

export function GET(req: TRequest, res: TResponse) {
    const user = req.getUserSession()

    res.html(
        `<body>
        <h1>User</h1>
        <p>${user?.user.name}</p>
        </body>
       `
    )
}
