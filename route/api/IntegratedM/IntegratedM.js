// 预约功能
const koa = require( 'koa')

const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()

const DB = require('../../db')
app.use(bodyParser());      // 将模块作为koa的中间件引入


// 查询全部课程信息
router.get("/integratedM", async (ctx) => {
    const data = await DB.find('user', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})




module.exports = router