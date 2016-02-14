
//import * as sod from "libsodium";


//console.log(sod.to_hex(sod.crypto_generichash(64, 'test')));
//console.log(sod.to_hex(sod.crypto_hash_sha256(64, 'test')));

var sodium = require('libsodium-wrappers');
console.log(sodium.to_hex(sodium.crypto_generichash(16, 'test')));


console.log(sodium.crypto_generichash_BYTES_MIN);
console.log(sodium.crypto_generichash_BYTES_MAX);

var key = sodium.randombytes_buf(sodium.crypto_shorthash_KEYBYTES),
    hash1 = sodium.crypto_shorthash(new Uint8Array([1, 2, 3, 4]), key),
    hash2 = sodium.crypto_shorthash('test', key);
console.log(key);
console.log(hash1);
console.log(sodium.to_hex(hash1));
console.log(hash2);
console.log(sodium.to_hex(hash2));


var hash_hex = sodium.crypto_shorthash('test', key, 'hex');

console.log(hash_hex);


var keypair = sodium.crypto_box_keypair();
console.log(keypair);
console.log(keypair.publicKey);
console.log(sodium.to_hex(keypair.publicKey));
console.log(keypair.privateKey);
console.log(sodium.to_hex(keypair.privateKey));
console.log(keypair.keyType);



