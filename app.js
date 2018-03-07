// HTTP 模块同时支持 Express 和 WebSocket
const http = require('http'); 
// 引用 express 来支持 HTTP Server 的实现
const express = require('express');
// 引用 wafer-session 支持小程序会话
const waferSession = require('wafer-node-session'); 
// 使用 MongoDB 作为会话的存储
const MongoStore = require('connect-mongo')(waferSession); 
// 引入配置文件
const config = require('./config'); 
const db = require('./db'); 



// 创建一个 express 实例
const app = express();

// 独立出会话中间件给 express 和 ws 使用
const sessionMiddleware = waferSession({
    appId: config.appId,
    appSecret: config.appSecret,
    loginPath: '/login',
    store: new MongoStore({
        url: `mongodb://${config.mongoUser}:${config.mongoPass}@${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`
    })
});
app.use(sessionMiddleware);

// 在路由 /me 下，输出会话里包含的用户信息
app.use('/me', (request, response, next) => { 
    response.json(request.session ? request.session.userInfo : { noBody: true }); 
    if (request.session) {
        console.log(`用户信息获取成功`);
        console.log(request.session.userInfo);
        //判断用户是否已经存在
        var openId = request.session.userInfo.openId;
        var nickName = request.session.userInfo.nickName;
        var gender = request.session.userInfo.gender;
        var country = request.session.userInfo.country;
        var province = request.session.userInfo.province;
        var city = request.session.userInfo.city;
        var language = request.session.userInfo.language;
        var queryusersql = 'SELECT id as a FROM user WHERE openid =\'' + openId + '\'';
        db.query(queryusersql,[],function (result) {
            console.log(result);
            console.log(result.length == 0);
            //存储新用户
            var addusersql = 'INSERT INTO user(id,nickname,gender,openid,country,province,city,language) VALUES(0,?,?,?,?,?,?,?)';
            var adduserSqlParams = [nickName, gender, openId, country, province, city, language];
            if (result.length == 0){
                db.query(addusersql,adduserSqlParams, function (result) {
                    console.log('--------------------------INSERT----------------------------');
                    console.log('INSERT ID:',result);        
                    console.log('-----------------------------------------------------------------\n\n');  
                })
            } else { 
                var id = result[0].a;
                var moduserSql = 'UPDATE user SET nickname = ?,gender=?,country=?,province=?, city=?, language=? WHERE id = ?';
                var moduserSqlParams = [nickName, gender, country, province, city, language,id];
                db.query(moduserSql,moduserSqlParams, function (result) {
                    console.log('--------------------------UPDATE----------------------------');
                    console.log('UPDATE ID:',result);        
                    console.log('-----------------------------------------------------------------\n\n');  
                })
                };
        });        
    }
}); 

// 实现一个中间件，对于未处理的请求，都输出 "Response from express"
app.use((request, response, next) => {
    response.write('Response from express');
    response.end();
});

// 创建 HTTP Server 而不是直接使用 express 监听
const server = http.createServer(app);

// 启动 HTTP 服务
server.listen(config.serverPort);

// 输出服务器启动日志
console.log(`Server listening at ${config.serverPort} port`);

//test