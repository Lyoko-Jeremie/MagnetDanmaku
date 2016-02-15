import poolmanager from "../lib/poolmanager-compiled";
import * as sodium from "libsodium-wrappers";



const videohash = sodium.to_base64(
    sodium.crypto_generichash(64, "videohashvideohashvideohash")
);

var pm = new poolmanager.damapoolmanager();
pm.getPool(videohash);
pm.verifyPoolList();

//var PoolList = {
//    "b": 0,
//    "a": 0,
//    "z": 0,
//    "c": 0
//};
//PoolList["x"] = 1;
//for (var i in PoolList) {
//    console.log(i + ":" + PoolList[i]);
//}
//
//console.log(5 + ":" + PoolList[5]);
//console.log(5 in PoolList);
//console.log("a" in PoolList);
//
//delete PoolList["a"];
//
//for (var i in PoolList) {
//    console.log(i + ":" + PoolList[i]);
//}





