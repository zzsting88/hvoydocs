# PM2 运行说明

这个文档站的预览命令是：

```bash
mint dev --port 3333
```

用 PM2 后台运行：

```bash
npm run pm2:start
```

PM2 配置会通过登录 shell 执行 `mint dev --port 3333`，这样可以复用你当前终端里可用的 `mint` 命令路径。

常用命令：

```bash
npm run pm2:status
npm run pm2:logs
npm run pm2:restart
npm run pm2:stop
```

如果机器重启后也要自动恢复，先确认 PM2 已安装，然后执行：

```bash
pm2 save
pm2 startup
```

`pm2 startup` 会输出一条需要复制执行的系统命令，按它的提示执行即可。
