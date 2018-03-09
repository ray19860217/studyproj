module.exports = { 
    serverPort: '8765', 

    // 小程序 appId 和 appSecret 
    // 请到 https://mp.weixin.qq.com 获取 AppID 和 AppSecret
    appId: 'wxaf4e716376c0f3d5', 
    appSecret: 'f32bbc58654ef68ef9f0eb129c7fa470', 

    //配置链接数据库参数
    host: '172.17.0.10',
    port : 3306,
    database : 'test',
    user : 'root',
    password : 'Dimai!0217',

    // mongodb 连接配置，生产环境请使用更复杂的用户名密码
    mongoHost: 'localhost', 
    mongoPort: '27017', 
    mongoUser: 'weapp', 
    mongoPass: 'weapp-dev', 
    mongoDb: 'studyproj',

};