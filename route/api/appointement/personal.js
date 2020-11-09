// 预约功能
const koa = require( 'koa')

const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()

const DB = require('../../db')
app.use(bodyParser());      // 将模块作为koa的中间件引入


// 查询全部信息
router.get("/appointment", async (ctx) => {
    const data = await DB.find('appointment', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// id查询
router.get("/appointment/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('appointment', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 个人预约
router.post("/appointment/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('appointment', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    // 随机数
    var Num="";
    for(var i=0;i<6;i++){
        Num += Math.floor(Math.random()*10);
    }

    console.log(Num)
    const params = {
        username:body.name,
        mobile:body.mobile,
        curriculum:body.region,
        // 预约号
        number:Num,
        // 对应账号id
        userId: body._id,
        type:1,
        id:ids
    }
    const data = await DB.insert('appointment', params)
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// 修改个人预约预留信息
router.post("/appointment/modify/:id", async (ctx) => {
    // 查询id
    let ids = ctx.params
    let id = parseInt(ids.id)
    var ChangedData = []
    await DB.find('appointment', {id: id}).then((data) => {
        ChangedData = data
    })
    let username = ''
    let mobile = ''
    let curriculum = ''
    for (const key in ChangedData) {
       username = ChangedData[key].username
       mobile = ChangedData[key].mobile
       curriculum = ChangedData[key].curriculum
    }
    const original = {
        username: username,
        mobile: mobile,
        curriculum: curriculum
    }

    // 修改内容
    let body = ctx.request.body
    const datas = await DB.update('appointment', original, body)
    console.log(datas.result);
    ctx.body = JSON.stringify(datas); // 响应请求，发送处理后的信息给客户端

})

// 删除个人预约
router.delete("/appointment/remove/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    const data = await DB.remove('appointment', {id: id})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})




module.exports = router