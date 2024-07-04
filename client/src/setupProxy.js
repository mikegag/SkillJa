const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8000', // Ensure this matches your Django server's URL
            changeOrigin: true,
        })
    );
}