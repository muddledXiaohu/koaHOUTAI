// 预约功能
const koa = require( 'koa')

const bodyParser= require('koa-bodyparser')
const fs= require('fs')
const path= require('path')

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

// 预约号登录查询
// 用户登录
router.post('/fractionss', async ctx => {
  const data = ctx.request.body
  console.log(data);
  await DB.find('fraction', {number: Number(data.number)}).then( async (datas) => {
      console.log(datas);
      if (datas.length === 0) {
          ctx.body = {
              'code': 0,
              'data': {},
              'mesg': '没有该预约id，请预约',
              status: 400
          }    
      }  else {
          // const token = await DB.find('fraction', {number: data.number})
          ctx.body = {
              'code': 1,
              'data': datas,
              'mesg': '登录成功',
              status: 200
          }
      }
  })
})

// 存入用户分数
router.post("/fraction/establish", async (ctx) => {
  const data = ctx.request.body
  const number = parseInt(data.number)
  const fraction = parseInt(data.fraction)
  await DB.update('fraction', {number: number}, {fraction: fraction}).then((datas) => {
    ctx.body = JSON.stringify(datas); // 响应请求，发送处理后的信息给客户端
  })
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

// 保存上传文件
router.post('/uploadfile', async (ctx, next) => {
    const file = ctx.request.files.file; // 上传的文件在ctx.request.files.file
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 修改文件的名称
    // var myDate = new Date();
    // var newFilename = myDate.getTime()+'.'+file.name.split('.')[1];
    var newFilename = ctx.request.files.file.name;
    var uploadPath = path.join(__dirname, '../../../static/image/') + `/${newFilename}`;
    //创建可写流
    const upStream = fs.createWriteStream(uploadPath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    //返回保存的路径
    return ctx.body = { code: 200, data: { url: 'http://' + ctx.headers.host + '/static/image/' + newFilename } };
  });

module.exports = router