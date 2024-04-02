import * as http from 'http'
export const html = {
    html: (html: string, res: http.ServerResponse) => {
        res.setHeader('Content-Type', 'text/html')
        res.write(html)
        res.end()
    },
}
