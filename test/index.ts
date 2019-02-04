import { Test, run } from 'beater';
import { tests as builderTests } from './builder';
import { tests as formatterTests } from './formatter';
import { tests as parserTests } from './parser';

const tests = ([] as Test[])
  .concat(builderTests)
  .concat(formatterTests)
  .concat(parserTests);

run(tests).catch(() => process.exit(1));
