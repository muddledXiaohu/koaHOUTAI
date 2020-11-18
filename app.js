
const koa = require( 'koa')

const render = require('koa-art-template')

const cors = require('koa-cors')

const koa_body = require("koa-body")
const koa_static = require("koa-static")
const path = require("path")


const bodyParser= require('koa-bodyparser')
// 实例化
const app = new koa()
const router = require('koa-router')()

// 引入子模块(子路由)
const users = require('./route/api/users.js')
const appointment = require('./route/api/appointement/personal')
const group = require('./route/api/appointement/group')
const IntegratedM = require('./route/api/IntegratedM/IntegratedM')

// ====================================================

// ====================================================

//设置跨域请求
app.use(cors())

app
.use(koa_body({
	multipart: true,
    formidable: {
        uploadDir: path.join(__dirname,"static/image"),
        keepExtensions: true,
        maxFileSize: 2*1024*1024,    // 设置上传文件大小最大限制，默认2M
    }
}))
.use(koa_static(__dirname,"public"))  // 指定 public文件托管


app.use(users.routes())
app.use(appointment.routes())
app.use(group.routes())
app.use(IntegratedM.routes())

// 配置路由
app.use(router.routes()).use(router.allowedMethods());


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})