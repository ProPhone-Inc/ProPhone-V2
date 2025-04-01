module.exports = {
  apps: [
    {
      name: 'prophone-server',
      script: 'dist/server/index.js',
      instances: 1,
      exec_mode: 'fork',
      wait_ready: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      node_args: '--max-old-space-size=256',
      source_map_support: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOST: process.env.HOST || '0.0.0.0',
        MONGODB_URI: 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/prophone?retryWrites=true&w=majority&appName=prophone&retryWrites=true&maxPoolSize=10&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000',
        TZ: 'UTC',
        FORCE_COLOR: '1',
        UV_THREADPOOL_SIZE: '1'
      }
    }
  ]
};