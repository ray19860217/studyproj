var mysql = require('mysql');
var databaseConfig = require('./config');  //引入数据库配置模块中的数据

//向外暴露方法
module.exports = {
    query : function(sql,params,callback){
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        var pool = mysql.createPool({
            connectionLimit : 10, 
            host : databaseConfig.host,
            port : databaseConfig.port,
            database : databaseConfig.database,
            user : databaseConfig.user,
            password : databaseConfig.password
            });        

         //开始数据操作
        pool.query( sql, params, function(err,results,fields ){
           if(err){
                console.log('数据操作失败');
                throw err;
            }
            //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
            callback && callback(results, fields);
            //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下

           });
    }
}