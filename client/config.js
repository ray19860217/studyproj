
//小程序全局参数

//正式环境服务器地址
//var host = 'https://166819362.aibenjia.club';
//开发环境
var host = 'https://95292500.aibenjia.club';

var config = {

  service : {
    host,
    //登陆url
    loginurl: `${host}/login`,
    //获取用户信息url
    userurl: `${host}/me`,
  }
};

module.exports = config;
