import * as http from 'http'
export const json = {
    json: (obj: unknown, res: http.ServerResponse) => {
        const str = JSON.stringify(obj)
        res.write(str)
        res.end()
    },
}
