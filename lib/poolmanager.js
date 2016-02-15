import * as sqlite from "sqlite3";
import * as sodium from "libsodium-wrappers";
sqlite.verbose();


/**
 * 弹幕池对象
 * 此对象需使用new构造
 */
function damapool(videohash_base64) {
    // 数据成员初始化
    this.videohash_hex = sodium.to_hex(sodium.from_base64(videohash_base64));
    this.memorydb = new sqlite.Database(':memory:');

    // 初始化成员函数  各个操作函数
    if (typeof damapool._initialized == "undefined") {
        /**
         * 持久化
         */
        damapool.prototype.saveToTableFile = function () {
            // TODO 持久化内存表到磁盘表
            // 删除磁盘文件
            // 创建磁盘表
            // 循环写入
            // 关闭磁盘文件
        };
        /**
         * 重载
         */
        damapool.prototype.loadFromTableFile = function () {
            // TODO 载入磁盘表到内存
            // 检查文件
            // 清除内存表
            // 载入文件
        };
        /**
         * 删除文件表
         */
        damapool.prototype.deleteTableFile = function () {

        };
        /**
         * 清空内存表
         */
        damapool.prototype.clearMemoryTable = function () {

        };
        /**
         * 重载内存表
         */
        damapool.prototype.reloadMemoryTable = function () {
            // TODO 清空内存表并载入磁盘表到内存
            damapool.clearMemoryTable();
            damapool.loadFromTableFile();
        };

        // 成员函数初始化完成
        damapool._initialized = true;
    }
    // TODO 初始化memorydb
    // 载入
    damapool.loadFromTableFile();
}
module.exports.damapool = damapool;


/**
 * 弹幕池管理器
 * 统一管理所有池
 */
function damapoolmanager() {

    /**
     * 池列表
     * map 表  虽然V8引擎没有以map方式实现
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
        damapoolmanager.prototype.getPool = function (videohash_base64) {
            const videohash_hex = sodium.to_hex(
                sodium.from_base64(videohash_base64)
            );
            if (!(videohash_hex in damapoolmanager.PoolList)) {
                damapoolmanager.PoolList[videohash_hex] =
                    new damapool(videohash_base64);
            }
            return damapoolmanager.PoolList[videohash_hex];
        };
        /**
         * 验证池列表
         */
        damapoolmanager.prototype.verifyPoolList = function () {
            for (var i in damapoolmanager.PoolList) {
                if (damapoolmanager.PoolList[i].videohash_hex !== i) {
                    const temp = damapoolmanager.PoolList[i];
                    delete damapoolmanager.PoolList[i];
                    damapoolmanager.PoolList[temp.videohash_hex] = temp;
                }
            }
        };

        damapoolmanager._initialized = true;
    }
}
module.exports.damapoolmanager = damapoolmanager;




