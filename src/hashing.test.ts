import * as nobleHashes from '@noble/hashes/sha256';
import { bytesToHex, stringToBytes } from "./bytes"
import { sha256 } from "./hashing"

describe('sha256', () => {
    it('returns a digest for a byte array', async () => {
        const digest = await sha256(stringToBytes("foo bar"));
        const hex = bytesToHex(digest);
        expect(hex).toStrictEqual('0xfbc1a9f858ea9e177916964bd88c3d37b91a1e84412765e29950777f265c4b75');
    });

    it('returns a digest for a larger byte array', async () => {
        const digest = await sha256(new Uint8Array(1024).fill(1));
        const hex = bytesToHex(digest);
        expect(hex).toStrictEqual('0x5a648d8015900d89664e00e125df179636301a2d8fa191c1aa2bd9358ea53a69');
    });

it('falls back to noble when digest function is unavailable', async () => {
    const nobleSpy = jest.spyOn(nobleHashes, 'sha256');

    Object.defineProperty(globalThis.crypto.subtle, 'digest', {
      value: undefined,
      writable: true,
    });

            const digest = await sha256(stringToBytes("foo bar"));
        const hex = bytesToHex(digest);
        expect(hex).toStrictEqual('0xfbc1a9f858ea9e177916964bd88c3d37b91a1e84412765e29950777f265c4b75');

    expect(nobleSpy).toHaveBeenCalled();
  });

  it('falls back to noble when subtle APIs are unavailable', async () => {
    const nobleSpy = jest.spyOn(nobleHashes, 'sha256');

    Object.defineProperty(globalThis.crypto, 'subtle', {
      value: undefined,
      writable: true,
    });

            const digest = await sha256(stringToBytes("foo bar"));
        const hex = bytesToHex(digest);
        expect(hex).toStrictEqual('0xfbc1a9f858ea9e177916964bd88c3d37b91a1e84412765e29950777f265c4b75');

    expect(nobleSpy).toHaveBeenCalled();
  });
})