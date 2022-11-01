"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const symlink_helper_1 = require("./symlink-helper");
exports.Config = {
    rootDir: process.argv[3],
    symlinksFile: '/.symlinks.json',
    helperClass: symlink_helper_1.SymlinkHelper
};
//# sourceMappingURL=config.js.map