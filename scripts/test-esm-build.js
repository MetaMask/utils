const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const mnemonicModule = readFileSync(
  path.resolve(__dirname, '../dist/mnemonic.mjs'),
  'utf8',
);

assert.match(
  mnemonicModule,
  /^import \* as \w+ from "@metamask\/scure-bip39\/dist\/wordlists\/english\.js";$/mu,
  'The ESM build must use a namespace import for the CommonJS wordlist module',
);
