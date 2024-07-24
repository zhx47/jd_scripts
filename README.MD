**20240421 重新修复**

已去除仓库中的半成品h5st算法，自行搭建h5st算法包，`https://hub.docker.com/r/zhx47/jd_h5st_server`。

导入环境变量

```shell
export H5ST_SERVER="http://192.168.100.1:3001"
```

```
ql repo https://github.com/zhx47/jd_scripts.git "jd_" "" "jdCookie|sendNotify|USER_AGENTS|utils" "master"
```

![1699272123111.png](https://pic.ziyuan.wang/2023/11/06/guest_07f7d8b3e9810.png)

容易403，只能少量跑几个号。

依赖是这些
```
adler-32
axios
crc
crypto-js
http-cookie-agent
jsdom
qs
tough-cookie
```