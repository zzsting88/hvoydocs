module.exports = {
  apps: [
    {
      name: "hvoydocs",
      script: "bash",
      args: ["-lc", "mint dev --port 3333"],
      cwd: __dirname,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
