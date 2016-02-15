/**
 * Created by Jeremie on 2016/2/7.
 *
 * 弹幕对象格式工厂
 *
 *  {版本号,   hash三元组(timestamp-userpubkey-videohash),    整个pgp签名的封装}
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

module.exports.createHashTriples =
    function (timestamp, user25519pubkey, videohash) {
        return {
            'timestamp': timestamp,
            'user25519pubkey': user25519pubkey,
            'videohash': videohash
        };
    };

module.exports.createDanmaStruct =
    function (type, content, videotimestamp, color, contenthash) {
        switch (type) {
            case "string":
                return {
                    "type": type,
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

module.exports.createPGPContent =
    function (version, HashTriples, DanmaStruct, user25519privatekey) {


        var jsonstring = JSON.stringify(
            {
                "version": version,
                "hashTriples": HashTriples,
                "danmaStruct": DanmaStruct
            }
        );

        return sodium.crypto_sign(
            jsonstring,
            user25519privatekey,
            "base64"
        );
    };


/**
 * 创建弹幕结构
 * @param content   弹幕UTF8字符串内容
 * @param videotimestamp    相对于视频开始处的时间 单位ms
 * @param color     16进制弹幕颜色 RGB(0xRRGGBB)或RGBA(0xRRGGBBAA)
 * @param user25519seed  用户25519keypairseed
 * @returns {{version, hashTriples, pgpContent}}
 */
module.exports.createDanmaFromStrngTypeDanmaContent =
    function (content, videotimestamp, color, videohash, user25519seed) {


        const version = 1;
        const type = "string";

        // 计算keypair
        const user25519keypair = sodium.crypto_sign_seed_keypair(
            user25519seed,
            "base64"
        );

        // 计算contenthash
        const contenthash = sodium.to_base64(
            sodium.crypto_generichash(16, content)
        );

        var dammastruct = module.exports.createDanmaStruct(
            type,
            content,
            videotimestamp,
            color,
            contenthash
        );

        var damHashTriples = module.exports.createHashTriples(
            Date.now(),
            user25519keypair.publicKey,
            videohash
        );


        return module.exports.createDanma(
            version,
            damHashTriples,
            module.exports.createPGPContent(
                version,
                damHashTriples,
                dammastruct,
                sodium.from_base64(user25519keypair.privateKey)
            )
        );

    };

/**
 * 验证弹幕格式是否正确
 * @param danma 弹幕
 * @returns {boolean}   返回true 或 false
 */
module.exports.checkDanma = function (danma) {
    try {
        if (danma.version !== 1) {
            return false;
        }

        const data = sodium.crypto_sign_open(
            sodium.from_base64(danma.pgpContent),
            sodium.from_base64(danma.hashTriples.user25519pubkey),
            "text"
        );
        //console.log(data);

        const datajson = JSON.parse(data);

        if (danma.version !== datajson.version) {
            console.log("danma.version !== datajson.version");
            return false;
        }
        if (danma.hashTriples.timestamp
            !==
            datajson.hashTriples.timestamp) {
            console.log("datajson.hashTriples.timestamp");
            return false;
        }
        if (danma.hashTriples.user25519pubkey
            !==
            datajson.hashTriples.user25519pubkey
        ) {
            console.log("datajson.hashTriples.user25519pubkey");
            return false;
        }
        if (danma.hashTriples.videohash
            !==
            datajson.hashTriples.videohash
        ) {
            console.log("datajson.hashTriples.videohash");
            return false;
        }
        if (datajson.danmaStruct.type
            !== "string"
        ) {
            console.log("string");
            return false;
        }
        if (datajson.danmaStruct.contenthash
            !==
            sodium.to_base64(
                sodium.crypto_generichash(16, datajson.danmaStruct.content)
            )
        ) {
            console.log("sodium.crypto_generichash()");
            return false;
        }


    } catch (e) {
        //console.log(e);
        console.log("error happend");
        return false;
    }
    return true;
};

/**
 * 验证PGPContent并从中恢复整个弹幕结构
 * @param Base64PGPContent  PGPContent
 * @param Base64User25519pubkey     公钥
 * @returns {*} 返回false验证失败     恢复成功返回弹幕结构      抛出异常则失败
 */
module.exports.restoreDanmaFromPGPContent =
    function (Base64PGPContent, Base64User25519pubkey) {

        const data = sodium.crypto_sign_open(
            sodium.from_base64(Base64PGPContent),
            sodium.from_base64(Base64User25519pubkey),
            "text"
        );

        //console.log(data);

        const datajson = JSON.parse(data);

        if (1 !== datajson.version) {
            console.log("danma.version !== datajson.version");
            return false;
        }
        if (typeof datajson.hashTriples.timestamp !== 'number'
        ) {
            console.log("datajson.hashTriples.timestamp type");
            return false;
        }
        if (datajson.hashTriples.timestamp < 0
        ) {
            console.log("datajson.hashTriples.timestamp");
            return false;
        }
        if (datajson.hashTriples.user25519pubkey
            !==
            Base64User25519pubkey
        ) {
            console.log("datajson.hashTriples.user25519pubkey");
            return false;
        }
        if (datajson.danmaStruct.type
            !== "string"
        ) {
            console.log("string");
            return false;
        }
        if (typeof datajson.hashTriples.videohash !== 'string') {
            console.log("datajson.hashTriples.contenthash");
            return false;
        }
        if (datajson.danmaStruct.contenthash
            !==
            sodium.to_base64(
                sodium.crypto_generichash(16, datajson.danmaStruct.content)
            )
        ) {
            console.log("sodium.crypto_generichash()");
            return false;
        }

        return {
            'version': datajson.version,
            'hashTriples': {
                'timestamp': datajson.hashTriples.timestamp,
                'user25591pubkey': datajson.hashTriples.user25519pubkey,
                'videohash': datajson.hashTriples.videohash
            },
            'pgpContent': Base64PGPContent
        };


    };








