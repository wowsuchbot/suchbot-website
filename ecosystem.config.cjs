module.exports = {
  apps: [
    {
      name: 'bot-website',
      script: './dist/server/entry.mjs',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 3000,
      env: {
        NODE_ENV: 'production',
        PORT: 4321
      }
    }
  ]
};
