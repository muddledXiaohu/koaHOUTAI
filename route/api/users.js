
const koa = require( 'koa')


const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()


const DB = require('../db')
app.use(bodyParser());      // 将模块作为koa的中间件引入

// =====================================================

var qr = require('qr-image');

const uuid = require('node-uuid')

// =====================================================

// 查询全部信息
router.get("/users", async (ctx) => {
    const data = await DB.find('users', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// id查询
router.get("/users/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('users', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 创建用户
router.post("/users/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('users', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    const params = {
        username:body.username,
        password:body.password,
        mobile:body.mobile,
        id:ids
    }
    const data = await DB.insert('users', params)
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// 修改用户
router.post("/users/modify/:id", async (ctx) => {
    // 查询id
    let ids = ctx.params
    let id = parseInt(ids.id)
    var ChangedData = []
    await DB.find('users', {id: id}).then((data) => {
        ChangedData = data
    })
    let username = ''
    let password = ''
    for (const key in ChangedData) {
       username = ChangedData[key].username
       password = ChangedData[key].password
    }
    const original = {
        username: username,
        password: password
    }

    // 修改内容
    let body = ctx.request.body
    const datas = await DB.update('users', original, body)
    console.log(datas.result);


})

// 删除用户
router.delete("/users/remove/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    const data = await DB.remove('users', {id: id})
    console.log(data.result);
})

// 用户登录
router.post('/login', async ctx => {
    const data = ctx.request.body
    await DB.find('users', {username: data.username}).then((datas) => {
        for (const key in datas) {
            const password = datas[key].password
        }
        if (datas.length === 0) {
            ctx.body = {
                'code': 0,
                'data': {},
                'mesg': '没有该用户，去注册吧'
            }    
        } else if (password !== data.password) {
            ctx.body = {
                'code': 0,
                'data': {},
                'mesg': '密码错误'
            }

        } else {
            ctx.body = {
                'code': 1,
                'data': data,
                'mesg': '登录成功'
            }
        }
    })
  })


// =====================================================




// =====================================================


module.exports = router