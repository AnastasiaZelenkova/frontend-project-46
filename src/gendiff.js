import parse from './parseFile.js';
import { program } from 'commander';
import path from 'path';
import { cwd } from 'process';
import * as fs from 'node:fs';

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
        if (typeof file1 === 'object'  && typeof file2 === 'object' && file1 !== null && file2 !== null) {
            console.log('succses!');
        }
    });

program.parse();
