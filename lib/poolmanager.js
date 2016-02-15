import * as sqlite from "sqlite3";
import * as sodium from "libsodium-wrappers";
import * as fs from "fs";
sqlite.verbose();


/**
 * 弹幕池对象
 * 此对象需使用new构造
 */
function damapool(videohash_base64) {
    // 数据成员初始化
    this.videohash_hex = sodium.to_hex(
        sodium.from_base64(videohash_base64)
    );
    //this.memorydb;

    // 初始化成员函数  各个操作函数
    if (typeof damapool._initialized == "undefined") {
        /**
         * 持久化
         */
        damapool.prototype.saveToTableFile = ()=> {
            // TODO 持久化内存表到磁盘表
            // 删除磁盘文件
            // 创建磁盘表
            // 循环写入
            // 关闭磁盘文件
        };
        /**
         * 载入磁盘表到内存
         */
        damapool.prototype.loadFromTableFile = ()=> {
            // TODO 载入磁盘表到内存
            const file = "./pooldatabase/" + videohash_hex + ".db";
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
        };
        /**
         * 删除文件表
         */
        damapool.prototype.deleteTableFile = ()=> {

        };
        /**
         * 清空内存表
         */
        damapool.prototype.clearMemoryTable = ()=> {
            if (memorydb in this) {
                this.closeDatabase();
            }
            this.initDatabase();
        };
        /**
         * 重载内存表
         */
        damapool.prototype.reloadMemoryTable = ()=> {
            // TODO 清空内存表并载入磁盘表到内存
            this.clearMemoryTable();
            this.loadFromTableFile();
        };

        /**
         * 添加弹幕到本池  如果元组重复返回false 成功返回true
         * @param damma
         */
        damapool.prototype.addDamma = (damma)=> {
            //
        };
        /**
         * 关闭数据库
         */
        damapool.prototype.closeDatabase = ()=> {
            this.memorydb.close();
            delete this.memorydb;
        };
        /**
         * 初始化memorydb
         */
        damapool.prototype.initDatabase = ()=> {
            this.memorydb = new sqlite.Database(':memory:');
            this.memorydb.run("CREATE TABLE dama (info TEXT)");
        };


        // 成员函数初始化完成
        damapool._initialized = true;
    }
    // 初始化
    this.initDatabase();
    // 载入
    this.loadFromTableFile();
}
module.exports.damapool = damapool;


/**
 * 弹幕池管理器
 * 统一管理所有池
 */
function damapoolmanager() {

    /**
     * 池列表
     * map 表  虽然
     * 以 "videohash_hex":damapool 的方式存储
     */
    this.PoolList = {};

    // 初始化成员函数  各个操作函数
    if (typeof damapoolmanager._initialized == "undefined") {
        /**
         * 获取池  不存在则创建
         * @param videohash_base64
         * @returns {damapool}
         */
        damapoolmanager.prototype.getPool = (videohash_base64)=> {
            const videohash_hex = sodium.to_hex(
                sodium.from_base64(videohash_base64)
            );
            if (!(videohash_hex in this.PoolList)) {
                this.PoolList[videohash_hex] =
                    new damapool(videohash_base64);
            }
            return this.PoolList[videohash_hex];
        };
        /**
         * 验证池列表
         */
        damapoolmanager.prototype.verifyPoolList = () => {
            for (var i in this.PoolList) {
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
        };

        /**
         * 释放PoolList
         */
        damapoolmanager.prototype.releasePoolList = ()=> {
            for (var i in this.PoolList) {
                this.PoolList[i].closeDatabase();
                delete this.PoolList[i];
            }
        };

        damapoolmanager._initialized = true;
    }
}
module.exports.damapoolmanager = damapoolmanager;




