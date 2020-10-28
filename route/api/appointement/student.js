// 预约功能
const koa = require( 'koa')

const bodyParser= require('koa-bodyparser')

// 实例化
const app = new koa()

const router = require('koa-router')()

const DB = require('../../db')
app.use(bodyParser());      // 将模块作为koa的中间件引入


// 查询全部信息
router.get("/student", async (ctx) => {
    const data = await DB.find('student', {})
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// id查询
router.get("/student/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    await DB.find('student', {id: id}).then((data) => {
        ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
    })
})

// 学校预约
router.post("/student/establish", async (ctx) => {
    let body = ctx.request.body
    
    const dataId = await DB.find('student', {})
    const lastId = dataId[dataId.length - 1]
    const ids = lastId.id + 1

    const params = {
        username:body.name,
        mobile:body.mobile,
        // 名单
        student:body.student,
        // 预约内容
        curriculum:body.region,
        // 介绍信
        introduce: body.introduce,
        type:2,
        id:ids
    }
    const data = await DB.insert('student', params)
    ctx.body = JSON.stringify(data); // 响应请求，发送处理后的信息给客户端
})

// 修改学校预约预留信息
// router.post("/student/modify/:id", async (ctx) => {
//     // 查询id
//     let ids = ctx.params
//     let id = parseInt(ids.id)
//     var ChangedData = []
//     await DB.find('student', {id: id}).then((data) => {
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
//     const datas = await DB.update('student', original, body)
//     console.log(datas.result);


// })

// 删除学校预约
router.delete("/student/remove/:id", async (ctx) => {
    let ids = ctx.params
    let id = parseInt(ids.id)
    const data = await DB.remove('student', {id: id})
    console.log(data.result);
})


module.exports = router