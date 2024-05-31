import { sign, verify } from 'jsonwebtoken'

const SECRET = process.env.SECRET ?? 'secret'
