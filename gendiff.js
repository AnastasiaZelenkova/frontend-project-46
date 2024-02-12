const { program } = require('commander');

program
    .description('Compares two configuration files and shows a difference.')
    .version('0.0.1')
    .option('-f, --format [type]', 'output format')
    .argument('<filepath1>')
    .argument('<filepath2>');

program.parse();