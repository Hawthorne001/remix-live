"use strict";(self["webpackChunk"]=self["webpackChunk"]||[]).push([[8874],{68874:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__="import { poseidon } from \"circomlibjs\" // v0.0.8\n\n// eslint-disable-next-line @typescript-eslint/no-var-requires\nconst snarkjs = require('snarkjs');\n\nconst logger = {\n  info: (...args) => console.log(...args),\n  debug: (...args) => console.log(...args),\n  error: (...args) => console.error(...args),\n};\n\n(async () => {\n  try {\n    // @ts-ignore\n    const r1csBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/calculate_hash.r1cs', { encoding: null });\n    // @ts-ignore\n    const r1cs = new Uint8Array(r1csBuffer);\n    // @ts-ignore\n    await remix.call('circuit-compiler', 'compile', 'circuits/calculate_hash.circom');\n    // @ts-ignore\n    const wasmBuffer = await remix.call('fileManager', 'readFile', 'circuits/.bin/calculate_hash.wasm', { encoding: null });\n    // @ts-ignore\n    const wasm = new Uint8Array(wasmBuffer);\n\n    const zkey_final = {\n      type: \"mem\",\n      data: new Uint8Array(JSON.parse(await remix.call('fileManager', 'readFile', './zk/keys/groth16/zkey_final.txt')))\n    }\n    const wtns = { type: \"mem\" };\n\n    const vKey = JSON.parse(await remix.call('fileManager', 'readFile', './zk/keys/groth16/verification_key.json'))\n\n    const value1 = '1234'\n    const value2 = '2'\n    const value3 = '3'\n    const value4 = '4'\n\n    const wrongValue = '5' // put this in the poseidon hash calculation to simulate a non matching hash.\n\n    const signals = {\n      value1,\n      value2,\n      value3,\n      value4,\n      hash: poseidon([value1, value2, value3, value4])\n    }\n\n    console.log('calculate')\n    await snarkjs.wtns.calculate(signals, wasm, wtns);\n\n    console.log('check')\n    await snarkjs.wtns.check(r1cs, wtns, logger);\n\n    console.log('prove')\n    const { proof, publicSignals } = await snarkjs.groth16.prove(zkey_final, wtns);\n\n    const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof, logger);\n    console.log('zk proof validity', verified);\n\n    const templates = {\n      groth16: await remix.call('fileManager', 'readFile', 'templates/groth16_verifier.sol.ejs')\n    }\n    const solidityContract = await snarkjs.zKey.exportSolidityVerifier(zkey_final, templates)\n\n    await remix.call('fileManager', 'writeFile', './zk/build/groth16/zk_verifier.sol', solidityContract)\n    await remix.call('fileManager', 'writeFile', 'zk/build/groth16/input.json', JSON.stringify({\n      _pA: [proof.pi_a[0], proof.pi_a[1]],\n      _pB: [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],\n      _pC: [proof.pi_c[0], proof.pi_c[1]],\n      _pubSignals: publicSignals,\n    }, null, 2))\n  } catch (e) {\n    console.error(e.message)\n  }\n})()\n"}}]);