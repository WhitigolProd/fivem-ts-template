const path = require('path');

// Add 2 separate configs and export them
module.exports = [
    // Server Bundler
    {
        mode: 'production',
        entry: './dist/server/server.js',
        output: {
            path: path.resolve(__dirname, 'dist/server'),
            filename: 'bundle.js'
        }
    },
    
    // Client Bundler
    {
        mode: 'production',
        entry: './dist/client/client.js',
        output: {
            path: path.resolve(__dirname, 'dist/client'),
            filename: 'bundle.js'
        }
    },

    // Shared Bundler
    {
        mode: 'production',
        entry: './dist/shared/shared.js',
        output: {
            path: path.resolve(__dirname, 'dist/shared'),
            filename: 'bundle.js'
        }
    }
]