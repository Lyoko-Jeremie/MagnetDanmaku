/**
 * Created by Jeremie on 2016/2/7.
 *
 * 弹幕对象格式工厂
 *
 *  {版本号,   hash三元组(timestamp-userpubkey-msghash),    整个pgp签名的封装}
 *
 *  pgp签名的封装的内容是这样
 *  {版本号,  hash三元组,  弹幕结构}
 *
 *  弹幕结构是这样
 *  { 内容，  其它参数..... }
 *
 *
 */

var sodium = require('libsodium-wrappers');

module.exports.createDanma = function (version, HashTriples, PGPContent) {
    return {
        'version': version,
        'hashTriples': HashTriples,
        'pgpContent': PGPContent
    };
};

module.exports.createHashTriples = function (timestamp, userpubkeyid, contenthash) {
    return {
        'timestamp': timestamp,
        'userpubkeyid': userpubkeyid,
        'contenthash': contenthash
    };
};

module.exports.createDanmaStruct = function (type, content, videotimestamp, color, contenthash) {
    switch (type) {
        case "string":
            return {
                "videotimestamp": videotimestamp,
                "color": color,
                "content": content,
                "contenthash": contenthash
            };
            break;
        default:
            //return {
            //};
            throw "Unimplemented";
            break;
    }
};

module.exports.createPGPContent = function (version, HashTriples, DanmaStruct, userpubkeyid) {


    var jsonstring = JSON.stringify(
        {
            "version": version,
            "hashTriples": HashTriples,
            "danmaStruct": DanmaStruct
        }
    );

    return jsonstring;  // TODO 使用userpubkeyid  调用pgp生成字符串
};


/**
 * 创建弹幕结构
 * @param content   弹幕UTF8字符串内容
 * @param videotimestamp    相对于视频开始处的时间 单位ms
 * @param color     16进制弹幕颜色 RGB(0xRRGGBB)或RGBA(0xRRGGBBAA)
 * @param userpubkeyid  用户签名公钥id
 * @returns {{version, hashTriples, pgpContent}}
 */
module.exports.createDanmaFromStrngTypeDanmaContent =
    function (content, videotimestamp, color, userpubkeyid) {

        const version = 1;
        const type = "string";


        // 计算contenthash
        const contenthash = sodium.to_hex(sodium.crypto_generichash(16, content));

        var dammastruct = module.exports.createDanmaStruct(
            type,
            content,
            videotimestamp,
            color,
            contenthash
        );

        var damHashTriples = module.exports.createHashTriples(
            Date.now(),
            userpubkeyid,
            contenthash
        );


        return module.exports.createDanma(
            version,
            damHashTriples,
            module.exports.createPGPContent(
                version,
                damHashTriples,
                dammastruct,
                userpubkeyid
            )
        );

    };








