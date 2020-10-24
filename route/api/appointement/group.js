// 预约功能
const koa = require( 'koa')

const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()

const DB = require('../../db')
app.use(bodyParser());      // 将模块作为koa的中间件引入


// 查询全部信息
router.get("/group", async (ctx) => {
    const data = await DB.find('group', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// id查询
router.get("/group/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('group', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 个人预约
router.post("/group/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('group', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    const params = {
        username:body.username,
        mobile:body.mobile,
        curriculum:body.curriculum,
        type:1,
        id:ids
    }
    const data = await DB.insert('group', params)
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// 修改个人预约预留信息
router.post("/group/modify/:id", async (ctx) => {
    // 查询id
    let ids = ctx.params
    let id = parseInt(ids.id)
    var ChangedData = []
    await DB.find('group', {id: id}).then((data) => {
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
    const datas = await DB.update('group', original, body)
    console.log(datas.result);


})

// 删除个人预约
router.delete("/group/remove/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    const data = await DB.remove('group', {id: id})
    console.log(data.result);
})




module.exports = router