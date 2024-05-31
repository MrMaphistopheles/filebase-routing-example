import { TRequest, TResponse } from 'src/pkg'

export function GET(req: TRequest, res: TResponse) {
    res.html(
        `<body>
        <h1>Google Authentication</h1>
        <a href="/auth/google/handler" style="text-decoration: none; color: #fff; background-color: #4285f4; margin-top: 20px; padding: 10px 20px; border-radius: 5px;">Authenticate with Google</a>
        </body>
       `
    )
}
