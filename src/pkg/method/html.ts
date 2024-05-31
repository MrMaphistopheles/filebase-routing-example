import * as http from 'http'
export const html = {
    html: (html: string, res: http.ServerResponse) => {
        res.write(html)
        res.end()
    },
}
