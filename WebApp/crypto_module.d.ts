/* tslint:disable */
/* eslint-disable */
/**
* given a public key (e, n), encrypts message m for this public key using RSA.
* @param {string} m
* @param {string} n
* @returns {string}
*/
export function encrypt(m: string, n: string): string;
/**
* @param {string} m
* @param {string} d
* @returns {string}
*/
export function verify(m: string, d: string): string;
/**
* stores the information for a given RSA keypair.
*/
export class Keypair {
  free(): void;
/**
* randomly generates a new keypair based on two seeds.
* @param {Uint8Array} seed_one
* @param {Uint8Array} seed_two
* @returns {Keypair}
*/
  static new(seed_one: Uint8Array, seed_two: Uint8Array): Keypair;
/**
* nicely outputs a formatted public key for use in the javascript code.
* improved since 0.2.0. Now outputs just n as a radix 32 string similar
* to how it is done here: http://gauss.ececs.uc.edu/Courses/c653/project/radix_32.html
* @returns {string}
*/
  public_key_display_wasm(): string;
/**
* given a ciphertext, attempts to decrypt based on the private key and modulo from this keypair. Performs
* simple decryption based on RSA algorithm.
* @param {string} ciphertext
* @returns {string}
*/
  decrypt(ciphertext: string): string;
/**
* given a private key (e, n), signs message m for this private key using RSA.
* @param {string} cleartext
* @returns {string}
*/
  sign(cleartext: string): string;
}
