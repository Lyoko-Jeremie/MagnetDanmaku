import fac from "../lib/danma-factory";
import * as sodium from "libsodium-wrappers";

const seed = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);

//console.log(sodium.crypto_sign_SEEDBYTES);

//console.log(seed);

const videohash = sodium.to_base64(
    sodium.crypto_generichash(64, "videohashvideohashvideohash")
);

const dama = fac.createDanmaFromStrngTypeDanmaContent(
    "content", 123451346, 0xFFFFFFFF, videohash, seed
);
console.log(dama);

console.log(fac.checkDanma(dama));

console.log(
    fac.restoreDanmaFromPGPContent(
        dama.pgpContent,
        dama.hashTriples.user25519pubkey
    )
);



