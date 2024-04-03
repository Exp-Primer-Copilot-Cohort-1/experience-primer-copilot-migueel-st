// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
const { getComments, addComment } = require('./comments');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url);
  if (req.method === 'GET') {
    if (pathname === '/comments') {
      const comments = getComments();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else if (req.method === 'POST') {
    if (pathname === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const params = querystring.parse(body);
        addComment(params.comment);
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end('Created');
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000/');
});