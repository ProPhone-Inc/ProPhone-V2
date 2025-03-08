module.exports = {
  apps: [
    {
      name: 'prophone-server',
      script: 'dist/server/index.js',
      instances: 1,
      exec_mode: 'cluster',
      wait_ready: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      node_args: '--max-old-space-size=256',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        TZ: 'UTC',
        FORCE_COLOR: '1',
        UV_THREADPOOL_SIZE: '1'
      }
    }
  ]
};