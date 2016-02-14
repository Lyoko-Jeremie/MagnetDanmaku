import fac from "../lib/danma-factory";
import * as sod from "libsodium-wrappers";

const seed = sod.randombytes_random("hex");

console.log(seed);

console.log(fac.createDanmaFromStrngTypeDanmaContent(
    "asdf", 123451346, 0xFFFFFFFF, seed
));



