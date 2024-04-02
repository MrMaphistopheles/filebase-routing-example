import * as http from 'http'
export const json = {
    json: (obj: unknown, res: http.ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        const str = JSON.stringify(obj)
        res.write(str)
        res.end()
    },
}
