const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000; // Port number for the server

const server = http.createServer((request, response) => {
    console.log('Request URL:', request.url);

    let filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './index.html'; // Default file to serve
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        // Add more MIME types as needed
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                response.writeHead(404);
                response.end('Not found');
            } else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
