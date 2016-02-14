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


module.exports.createDanma = function (version, HashTriples, PGPContent) {
    return {
        'version': version,
        'hashTriples': HashTriples,
        'pgpContent': PGPContent
    };
};

module.exports.createHashTriples = function (timestamp, userpubkeyid, msgcontenthash) {
    return {
        'timestamp': timestamp,
        'userpubkeyid': userpubkeyid,
        'msgcontenthash': msgcontenthash
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


module.exports.createDanmaFromStrngTypeDanmaContent =
    function (content, videotimestamp, color, userpubkeyid) {

        const version = 1;
        const type = "string";

        const contenthash = "contenthash";  // TODO 计算contenthash
        const msgcontenthash = "msgcontenthash";  // TODO 计算msgcontenthash

        var damstruct = module.exports.createDanmaStruct(
            type,
            content,
            videotimestamp,
            color,
            contenthash
        );

        var damHashTriples = module.exports.createHashTriples(
            Date.now(),
            userpubkeyid,
            msgcontenthash
        );


        return module.exports.createDanma(
            version,
            damHashTriples,
            module.exports.createPGPContent(
                version,
                damHashTriples,
                damstruct,
                userpubkeyid
            )
        );

    };








