
const MongoDB = require('mongodb')


const Config = require('./config');
const { MongoClient } = require('mongodb');


const ObjectID = MongoDB.ObjectID

class Db {


    // static getInstance() {  // 单例
    //     if (!Db.instance) {
    //         Db.instance = new Db()
    //     }else{
    //         return Db.instance
    //     }
    // }

    constructor() {
        this.dbClien = ''
        // this.connect();
    }

    // 连接数据库
    connect() {
        return new Promise((res, req) => {
            if (!this.dbClien) {  // 解决数据库多次连接的问题
                MongoClient.connect(Config.dbUrl, (err, client) => {
                    if (err) {
                        req(err)
                    }else{
                        const db = client.db(Config.dbName)
                        this.dbClien = db
                        res(db)
                    }
                })
            }else{
                res(this.dbClien)
            }
        })
    }

    // 查询数据
    find(collecionName, json) {
        return new Promise((res, req) => {
            this.connect().then((db) => {
                const result = db.collection(collecionName).find(json)
                result.toArray((err,docs) => {
                    if (err) {
                        req(err)
                        return
                    }
                    res(docs)
                })
            })
        })
    }

        // 分页查询数据
    count(collectionname,json,limit,skip) {
        return new Promise((res, req) =>{
            this.connect().then((db) => {
                const result = db.collection(collectionname).find(json).limit(limit).skip(skip)
                result.toArray(function (err,docs) {
                // callback(err,docs);
                if (err) {
                    req(err)
                    return
                }
                res(docs)
                })
            })
        })
    }

    // 更新数据
    update(collecionName, json1, json2) {
        return new Promise((res, req) => {
            this.connect().then((db) => {
                db.collection(collecionName).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        return req(err)
                    }else{
                        res(result)
                    }
                })
                
            })
        })
    }

    // 添加数据
    insert(collecionName, json) {

        return new Promise((res, req) => {
            this.connect().then((db) => {
                db.collection(collecionName).insertOne(json, (err, result) => {
                    if (err) {
                        return req(err)
                    }else{
                        res(result)
                    }
                })
                
            })
        })

    }

    // 删除数据
    remove(collecionName, json) {
        return new Promise((res, req) => {
            this.connect().then((db) => {
                db.collection(collecionName).removeOne(json, (err, result) => {
                    if (err) {
                        return req(err)
                    }else{
                        res(result)
                    }
                })
                
            })
        })
    }

    // 把mongodb里id做转换
    getObjectID(id) {
        return new ObjectID(id);  
    }

}

// const myDb = new Db()
// // const myDb = Db.getInstance()

// // setTimeout(() => {
//     myDb.find('user', {}).then((data) => {
//         console.log(data);
//     })
// // }, 0);

module.exports = new Db()
