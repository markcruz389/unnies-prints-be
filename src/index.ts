import http from 'http'

export const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-type': 'application/json' })
    res.end(JSON.stringify({ data: 'It works!' }))
})

server.listen(3000, () => console.log('Server running on port 3000'))
