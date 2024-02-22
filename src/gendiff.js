#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { cwd } from 'process';
import * as fs from 'node:fs';
import isEqual from 'lodash/isEqual.js';
import parse from './parseFile.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format [type]', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((filepath1, filepath2) => {
    const firstFilePath = path.resolve(`${cwd()}/__fixtures__`, filepath1);
    const secondFilePath = path.resolve(`${cwd()}/__fixtures__`, filepath2);
    const file1 = parse(fs.readFileSync(firstFilePath));
    const file2 = parse(fs.readFileSync(secondFilePath));
    const file1Entries = Object.entries(file1);
    const file2Entries = Object.entries(file2);
    const result = [];
    file1Entries.forEach(([key, value]) => {
      if (!Object.hasOwn(file2, key)) {
        result.push({ sign: '-', key, value });
      } else if (Object.hasOwn(file2, key) && isEqual(value, file2[key])) {
        result.push({ sign: ' ', key, value });
      } else if (Object.hasOwn(file2, key)) {
        result.push({ sign: '-', key, value });
        result.push({ sign: '+', key, value: file2[key] });
      } else {
        result.push({ sign: '-', key, value });
      }
    });
    file2Entries.forEach(([key, value]) => {
      if (!Object.hasOwn(file1, key)) {
        result.push({ sign: '+', key, value });
      }
    });
    result.sort((a, b) => {
      if (a.key > b.key) {
        return 1;
      }
      if (a.key === b.key) {
        if (a.sign === '+') {
          return 1;
        }
        if (a.sign === '-') {
          return -1;
        }
      }
      if (a.key < b.key) {
        return -1;
      }
      return 0;
    });
    const resultStr = result.map((entity) => `  ${entity.sign} ${entity.key}: ${entity.value}`);
    console.log(`{\n${resultStr.join('\n')}\n}`);
  });

program.parse();
