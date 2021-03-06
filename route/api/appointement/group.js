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

// 团体预约
router.post("/group/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('group', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    const params = {
        username:body.name,
        mobile:body.mobile,
        // 名单
        group:body.group,
        // 预约内容
        curriculum:body.region,
        // 介绍信
        introduce: body.introduce,
        type:2,
        id:ids
    }
    for (const key in body.group) {
        // 随机数
        var Num = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        const dataId = await DB.find('appointment', {})
        const lastId = dataId[dataId.length - 1]
        const ids = lastId.id + 1

        const paramss = {
            username:body.group[key].username,
            sex:body.group[key].sex,
            mobile:body.group[key].mobile,
            Company:body.group[key].Company,
            curriculum:body.region,
            fraction: 0,
            // 预约号
            number:Number(Num),
            // // 对应账号id
            // userId: body.id,
            type:2,
            id:ids
        }
        // 将个人预约添加到fraction 做小程序登录用
        var datas = await DB.insert('fraction', paramss)
    }
    const data = await DB.insert('group', params)
    ctx.body = JSON.stringify(data, datas); // 响应请求，发送处理后的信息给客户端
})

// 修改团体预约预留信息
// router.post("/group/modify/:id", async (ctx) => {
//     // 查询id
//     let ids = ctx.params
//     let id = parseInt(ids.id)
//     var ChangedData = []
//     await DB.find('group', {id: id}).then((data) => {
//         ChangedData = data
//     })
//     let username = ''
//     let mobile = ''
//     let curriculum = ''
//     for (const key in ChangedData) {
//        username = ChangedData[key].username
//        mobile = ChangedData[key].mobile
//        curriculum = ChangedData[key].curriculum
//     }
//     const original = {
//         username: username,
//         mobile: mobile,
//         curriculum: curriculum
//     }

//     // 修改内容
//     let body = ctx.request.body
//     const datas = await DB.update('group', original, body)
//     console.log(datas.result);

// })



// 删除团体预约
router.delete("/group/remove/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    const data = await DB.remove('group', {id: id})
})


module.exports = router