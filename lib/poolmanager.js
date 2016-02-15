import * as sqlite from "sqlite3";
import * as sodium from "libsodium-wrappers";
import * as fs from "fs";
sqlite.verbose();


/**
 * 弹幕池对象
 * 此对象需使用new构造
 */
module.exports.damapool = class damapool {
    constructor(videohash_base64) {
        // 数据成员初始化
        //this.memorydb;
        this.videohash_hex = sodium.to_hex(
            sodium.from_base64(videohash_base64)
        );
        // 初始化
        this.initDatabase();
        // 载入
        this.loadFromTableFile();
    }

    /**
     * 持久化
     */
    saveToTableFile() {
        // TODO 持久化内存表到磁盘表
        // 删除磁盘文件
        // 创建磁盘表
        // 循环写入
        // 关闭磁盘文件
    }

    /**
     * 载入磁盘表到内存
     */
    loadFromTableFile() {
        // TODO 载入磁盘表到内存
        const file = "./pooldatabase/" + this.videohash_hex + ".db";
        // 检查文件
        if (!fs.existsSync(file)) {
            return false;
        }
        try {
            // 打开文件
            var fdb = new sqlite.Database(file);
            // 载入文件
            this.memorydb.serialize(()=> {
                    this.memorydb.run(
                        "insert into dama select * from ;"
                    );
                }
            );
        } catch (e) {
            e.print();
            return false;
        }
        return true;
    }

    /**
     * 删除文件表
     */
    deleteTableFile() {

    }

    /**
     * 清空内存表
     */
    clearMemoryTable() {
        if (memorydb in this) {
            this.closeDatabase();
        }
        this.initDatabase();
    }

    /**
     * 重载内存表
     */
    reloadMemoryTable() {
        // 清空内存表并载入磁盘表到内存
        this.clearMemoryTable();
        this.loadFromTableFile();
    }

    /**
     * 添加弹幕到本池  如果元组重复返回false 成功返回true
     * @param damma
     */
    addDamma(damma) {

    }

    /**
     * 关闭数据库
     */
    closeDatabase() {
        this.memorydb.close();
        delete this.memorydb;
    }

    /**
     * 初始化memorydb
     */
    initDatabase() {
        this.memorydb = new sqlite.Database(':memory:');
        this.memorydb.run("CREATE TABLE dama (info TEXT)");
    }

};


/**
 * 弹幕池管理器
 * 统一管理所有池
 */
module.exports.damapoolmanager = class damapoolmanager {
    constructor() {
        /**
         * 池列表
         * map表  虽然JS不以hash排序方式实现
         * 以 "videohash_hex":damapool 的方式存储
         */
        this.PoolList = {};
    }

    /**
     * 获取池  不存在则创建
     * @param videohash_base64
     * @returns {damapool}
     */
    getPool(videohash_base64) {
        const videohash_hex = sodium.to_hex(
            sodium.from_base64(videohash_base64)
        );

        if (this.PoolList.hasOwnProperty(videohash_hex)) {
            this.PoolList[videohash_hex] =
                new module.exports.damapool(videohash_base64);
        }
        return this.PoolList[videohash_hex];
    }

    /**
     * 验证池列表
     */
    verifyPoolList() {
        for (var i in this.PoolList) {
            if (this.PoolList.hasOwnProperty(i)) {
                if (this.PoolList[i].videohash_hex !== i) {
                    const temp = this.PoolList[i];
                    delete this.PoolList[i];
                    this.PoolList[temp.videohash_hex] = temp;
                    //console.log(i + " not ok");
                }
                //else {
                //    console.log(i + " is ok");
                //}
            }
        }
    }

    /**
     * 释放PoolList
     */
    releasePoolList() {
        for (var i in this.PoolList) {
            if (this.PoolList.hasOwnProperty(i)) {
                this.PoolList[i].closeDatabase();
                delete this.PoolList[i];
            }
        }
    }
};




