
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

// ====================================================

// ====================================================

//设置跨域请求
app.use(cors())

app
.use(koa_body({
	multipart: true,
    formidable: {
        uploadDir: path.join(__dirname,"static/image"),
        keepExtensions: true
    }
}))
.use(koa_static(__dirname,"public"))  // 指定 public文件托管


app.use(users.routes())

// 配置路由
app.use(router.routes()).use(router.allowedMethods());


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on ${port}`);
})