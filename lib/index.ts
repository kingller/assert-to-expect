#!/usr/bin/env node
import { Command, InvalidArgumentError } from 'commander';
import { stat, readdir, readFile, writeFile } from 'fs/promises';
import type { Stats } from 'fs';
import * as chalk from 'chalk';
import * as path from 'path';

const program = new Command();
program.argument('<path>', 'path').option('-m --matchRegex <string>', 'match file regex', function matchRegex(value) {
    if (typeof value !== 'string') {
        throw new InvalidArgumentError('Not a string.');
    }
    try {
        return new RegExp(value);
    } catch (e) {
        throw new InvalidArgumentError(e);
    }
});

program.parse(process.argv);

const toDealPath = program.args[0];

const options = program.opts();

async function dealWithFile(filePath) {
    if (options.matchRegex) {
        if (!(options.matchRegex as RegExp).test(path.resolve(filePath))) {
            return;
        }
    }
    const content = await readFile(filePath, 'utf8');
    if (content) {
        const replacedContent = content
            .replace(/(assert.strictEqual\()([\s\S]+?)(,)/g, 'expect($2).toBe(')
            .replace(/(assert.deepStrictEqual\()([\s\S]+?)(,)/g, 'expect($2).toEqual(')
            .replace(/(assert\()([\s\S]+?)(\);+\s*\n+)/g, 'expect($2).toBe(true$3')
            .replace(/import assert from 'assert';?\s*/, '');

        if (replacedContent !== content) {
            await writeFile(filePath, replacedContent);
            console.log(chalk.green(`${path.resolve(filePath)} has been modified successfully!`));
        }
    }
}

async function readDirByPath(dirPath: string) {
    const list = await readdir(dirPath);
    list.forEach(async function (item) {
        const itemPath = path.join(dirPath, item);
        const itemStat = await stat(itemPath);
        if (itemStat.isDirectory()) {
            await readDirByPath(itemPath);
        } else {
            if (itemStat.isFile()) {
                await dealWithFile(itemPath);
            }
        }
    });
}

(async function assertToExpect() {
    let pathStat: Stats;
    try {
        pathStat = await stat(toDealPath);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.log(chalk.red(`Error: path \`${toDealPath}\` is not exist!`));
        } else {
            console.log(e);
        }
        return;
    }
    if (pathStat.isDirectory()) {
        await readDirByPath(toDealPath);
    } else if (pathStat.isFile()) {
        await dealWithFile(toDealPath);
    } else {
        console.log(chalk.red(`Error: path \`${toDealPath}\` must be a directory or file!`));
    }
})();
