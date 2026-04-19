module.exports = {
  apps: [
    {
      name: 'bot-website',
      script: '/var/www/bot.mxjxn.com/server/entry.mjs',
      cwd: '/root/.openclaw/services/bot-website',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 3000,
      env: {
        NODE_ENV: 'production',
        HOST: '::',
        PORT: 4321
      }
    }
  ]
};
