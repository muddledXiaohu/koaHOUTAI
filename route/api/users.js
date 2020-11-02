
const koa = require( 'koa')


const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()


const DB = require('../db')

// 引入token生成
const jwt = require('jsonwebtoken')

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
    ctx.body = JSON.stringify(datas); // 响应请求，发送处理后的信息给客户端

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
            var password = datas[key].password
        }
        if (datas.length === 0) {
            ctx.body = {
                'code': 0,
                'data': {},
                'mesg': '没有该用户，请注册',
                status: 400
            }    
        } else if (password !== data.password) {
            ctx.body = {
                'code': 0,
                'data': {},
                'mesg': '密码错误',
                status: 400
            }

        } else {
            const secret = 'secret'
            function getToken(payload = {}) {
                return jwt.sign(payload, secret, { expiresIn: '4h' })
            }
            let token = getToken({uid: "12306", username: "EsunR"}) // 将关键信息记录与 Token 内
            console.log(token)
            ctx.body = {
                'code': 1,
                'data': {
                    token
                },
                'mesg': '登录成功',
                status: 200
            }
        }
    })
  })


// 分数查询


// =====================================================


// 生成uuid二维码
var qwe = ''
router.get('/RQCode', async ctx => {
    var ID = uuid.v1();
    this.qwe = ID
    try {
        var img = qr.image('http://192.168.3.75:8080/#/start?uid=' + ID,{size :10});
      
        ctx.type= 'image/png';
        ctx.body = img;
    } catch (e) {
        ctx.type='text/html;charset=utf-8';
        ctx.body='<h1>414 Request-URI Too Large</h1>';
    }

})


// 扫码调用接口
router.post('/RQLongin', async ctx => {
    let body = ctx.request.body
    console.log(body, qwe)
    const user = body.username
    await DB.insert('RQCodeId', {user: qwe})
    ctx.body = JSON.stringify(user); // 响应请求，发送处理后的信息给客户端
})

// =====================================================


module.exports = router