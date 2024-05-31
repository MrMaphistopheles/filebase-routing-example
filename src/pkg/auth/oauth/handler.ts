import { log } from 'console'
import dotenv from 'dotenv'
import { TRequest, TResponse } from '../../index'

dotenv.config()
export function GET(req: TRequest, res: TResponse) {
    const scope = 'https://www.googleapis.com/auth/plus.login'
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${scope}`

    res.redirect(authUrl)
}
