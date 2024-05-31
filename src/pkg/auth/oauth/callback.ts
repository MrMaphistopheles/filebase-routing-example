import { TRequest, TResponse } from '../../index'
import { sign } from 'jsonwebtoken'

import dotenv from 'dotenv'

dotenv.config()

/**
 * Handles the callback from the OAuth provider after the user has authenticated.
 *
 * @param {TRequest} req - The incoming request object.
 * @param {TResponse} res - The outgoing response object.
 * @returns {Promise<void>} Promise that resolves when the function is complete.
 */
export async function GET(req: TRequest, res: TResponse): Promise<void> {
    // Retrieve the authorization code from the request parameters
    const params = req.getParams()
    const code = params?.reduce((acc: string, i) => {
        if ('code' in i) {
            acc = i.code
        }
        return acc
    }, '')

    // If no code is provided, redirect the user back to the authentication page
    if (!code) {
        res.redirect('/auth/google')
        return
    }

    try {
        // Exchange the authorization code for an access token
        const tokenResponse = await fetch(
            'https://oauth2.googleapis.com/token',
            {
                method: 'POST',
                body: JSON.stringify({
                    code: code,
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    redirect_uri: process.env.REDIRECT_URI,
                    grant_type: 'authorization_code',
                }),
            }
        )

        const data = (await tokenResponse.json()) as { access_token: string }
        const { access_token } = data

        // Retrieve user information using the access token
        const userResponse = await fetch(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        )

        const user = await userResponse.json()

        // Create a JSON Web Token (JWT) with the user information
        const token = sign(
            {
                user: user,
            },
            process.env.SECRET ?? 'secret',
            {
                expiresIn: '30d',
            }
        )

        // Set the token as a cookie in the response
        res.setCookie({
            name: 'token',
            value: token,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })

        // Redirect the user back to the root page
        res.redirect('/')
    } catch (error) {
        // TODO: handle error
        console.log(error)
    }
}
