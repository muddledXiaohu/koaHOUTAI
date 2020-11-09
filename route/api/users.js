
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

//   预约号登录
router.post('/loginNumber', async ctx => {
    const data = ctx.request.body
    await DB.find('appointment', {number: data.number}).then((datas) => {
        if (datas.length === 0) {
            ctx.body = {
                'code': 0,
                'data': {},
                'mesg': '没有该预约，请进行预约',
                status: 400
            }    
        } else {
            ctx.body = {
                'code': 1,
                'data': {
                    datas
                },
                'mesg': '登录成功',
                status: 200
            }
        }
    })
  })

// =====================================================

// 分数查询
router.get("/fraction", async (ctx) => {
    const data = await DB.find('fraction', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// id查询
router.get("/fraction/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('fraction', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 存入用户分数
router.post("/fraction/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('fraction', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    const params = {
        username:body.username,
        fraction:body.fraction,
        curriculum:body.curriculum,
        id:ids 
    }
    const data = await DB.insert('fraction', params)
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})


// 表单分页
router.post("/fraction",async (ctx) => {
    //koa-bodyparser解析前端参数
    let reqParam= ctx.request.body;//
    let querya = String(reqParam.params.query);//检索内容
    let page = Number(reqParam.params.pagenum);//当前第几页
    let size = Number(reqParam.params.pagesize);//每页显示的记录条数

    const everyOne =  await DB.find('fraction') //表总记录数
    //显示符合前端分页请求的列表查询
    // let options = { "limit": size,"skip": (page-1)*size};
    await DB.count('fraction', {username: new RegExp(querya)}, size, (page-1)*size).then((datas) => {
        //返回给前端
        ctx.body = JSON.stringify({totalpage:everyOne.length,pagenum:page,pagesize:size, users: datas})
    })
    //是否还有更多
    // let hasMore=totle-(page-1)*size>size?true:false;
  });

// =====================================================

// 生成uuid二维码
var qwe = ''
router.get('/RQCode', async ctx => {
    var ID = uuid.v1();
    qwe = ID
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
    let user = body.username
    const RQlgs = {[qwe]: user}
    console.log(user, qwe)
    await DB.insert('RQCodeId', RQlgs).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 二维码扫码成功后查询返回对应账户
router.get("/uuid/:id", async (ctx) => {
    let ids = ctx.params
    await DB.find('RQCodeId', ids.id).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// =====================================================


// 课程查询
router.post("/curriculim", async (ctx) => {
    //koa-bodyparser解析前端参数
    let reqParam= ctx.request.body;//
    let querys = String(reqParam.params.query);//检索内容
    let page = Number(reqParam.params.pagenum);//当前第几页
    let size = Number(reqParam.params.pagesize);//每页显示的记录条数

    const everyOne =  await DB.find('user') //表总记录数
    //显示符合前端分页请求的列表查询
    // let options = { "limit": size,"skip": (page-1)*size};
    await DB.count('user', {username: new RegExp(querys)}, size, (page-1)*size).then((datas) => {
        //返回给前端
        ctx.body = JSON.stringify({totalpage:everyOne.length,pagenum:page,pagesize:size, users: datas})
    })
    //是否还有更多
    // let hasMore=totle-(page-1)*size>size?true:false;
})

// id查询
router.get("/user/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('user', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 修改课程
router.post("/user/modify:id", async (ctx) => {
    // 查询id
    let ids = ctx.params
    let id = parseInt(ids.id)
    var ChangedData = []
    await DB.find('user', {id: id}).then((data) => {
        ChangedData = data
    })
    let image = ''
    for (const key in ChangedData) {
       image = ChangedData[key].image
    }
    const original = {
        image: image,
    }
    // 修改内容
    let body = ctx.request.body
    const datas = await DB.update('user', original, body)
    console.log(datas.result);
    ctx.body = JSON.stringify(datas); // 响应请求，发送处理后的信息给客户端
})


module.exports = router