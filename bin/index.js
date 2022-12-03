#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var commander_1 = require("commander");
var promises_1 = require("fs/promises");
var chalk = require("chalk");
var path = require("path");
var program = new commander_1.Command();
program.argument('<path>', 'path').option('-m --matchRegex <string>', 'match file regex', function matchRegex(value) {
    if (typeof value !== 'string') {
        throw new commander_1.InvalidArgumentError('Not a string.');
    }
    try {
        return new RegExp(value);
    }
    catch (e) {
        throw new commander_1.InvalidArgumentError(e);
    }
});
program.parse(process.argv);
var toDealPath = program.args[0];
var options = program.opts();
function dealWithFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var content, replacedContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options.matchRegex) {
                        if (!options.matchRegex.test(path.resolve(filePath))) {
                            return [2 /*return*/];
                        }
                    }
                    return [4 /*yield*/, (0, promises_1.readFile)(filePath, 'utf8')];
                case 1:
                    content = _a.sent();
                    if (!content) return [3 /*break*/, 3];
                    replacedContent = content
                        .replace(/(assert.strictEqual\()([\s\S]+?)(,)/g, 'expect($2).toBe(')
                        .replace(/(assert.deepStrictEqual\()([\s\S]+?)(,)/g, 'expect($2).toEqual(')
                        .replace(/(assert\()([\s\S]+?)(\);+\s*\n+)/g, 'expect($2).toBe(true$3')
                        .replace(/import assert from 'assert';?\s*/, '');
                    if (!(replacedContent !== content)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.writeFile)(filePath, replacedContent)];
                case 2:
                    _a.sent();
                    console.log(chalk.green("".concat(path.resolve(filePath), " has been modified successfully!")));
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function readDirByPath(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readdir)(dirPath)];
                case 1:
                    list = _a.sent();
                    list.forEach(function (item) {
                        return __awaiter(this, void 0, void 0, function () {
                            var itemPath, itemStat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        itemPath = path.join(dirPath, item);
                                        return [4 /*yield*/, (0, promises_1.stat)(itemPath)];
                                    case 1:
                                        itemStat = _a.sent();
                                        if (!itemStat.isDirectory()) return [3 /*break*/, 3];
                                        return [4 /*yield*/, readDirByPath(itemPath)];
                                    case 2:
                                        _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        if (!itemStat.isFile()) return [3 /*break*/, 5];
                                        return [4 /*yield*/, dealWithFile(itemPath)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
(function assertToExpect() {
    return __awaiter(this, void 0, void 0, function () {
        var pathStat, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.stat)(toDealPath)];
                case 1:
                    pathStat = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1.code === 'ENOENT') {
                        console.log(chalk.red("Error: path `".concat(toDealPath, "` is not exist!")));
                    }
                    else {
                        console.log(e_1);
                    }
                    return [2 /*return*/];
                case 3:
                    if (!pathStat.isDirectory()) return [3 /*break*/, 5];
                    return [4 /*yield*/, readDirByPath(toDealPath)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    if (!pathStat.isFile()) return [3 /*break*/, 7];
                    return [4 /*yield*/, dealWithFile(toDealPath)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.log(chalk.red("Error: path `".concat(toDealPath, "` must be a directory or file!")));
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
})();
