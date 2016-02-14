import fac from "../lib/danma-factory";
import * as sodium from "libsodium-wrappers";

const seed = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);

//console.log(sodium.crypto_sign_SEEDBYTES);

//console.log(seed);

const dama = fac.createDanmaFromStrngTypeDanmaContent(
    "asdf", 123451346, 0xFFFFFFFF, seed
);
console.log(dama);

console.log(fac.checkDanma(dama));

console.log(
    fac.restoreDanmaFromPGPContent(
        dama.pgpContent,
        dama.hashTriples.user25591pubkey
    )
);



