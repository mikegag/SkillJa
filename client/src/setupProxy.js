const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://127.0.0.1:8000',  // Adjusted target URL
            changeOrigin: true,
            secure: false,  // Disable secure flag if not using HTTPS
            headers: {
                Host: 'localhost:8000',  // Manually set Host header if needed
            },
        })
    );
}