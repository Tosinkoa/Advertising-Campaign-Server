module.exports = {
  apps: [
    {
      name: "advertising_server",
      script: "server.js",
      instances: 2,
      max_memory_restart: "300M",
      // Logging
      out_file: "./out.log",
      error_file: "./error.log",
      merge_logs: true,
      log_date_format: "DD-MM HH:mm:ss Z",
      log_type: "json",
      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
        exec_mode: "cluster_mode",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 8080,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules",
          "./test",
          "./db",
          "./package.json",
          "./yarn.lock",
          "./src",
          "./error.log",
          "./out.log",
        ],
      },
    },
  ],
};
