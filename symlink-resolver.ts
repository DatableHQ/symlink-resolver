import * as child_process from 'child_process';
import { Config } from './config';

/**
 * NOTICE: This tool has been created to handle symlinks which NativeScript doesn't support for 22.04.2017
 *         Tested on MacOS Sierra, should work also on most popular linux distributions
 * WARNING: Changes made on symlinked files during compilation start will be lost!
 * USAGE: You can use direct execute command: ts-node symlink-resolver.ts build|clear
 *        Or use compiled version the same way yet run by clear node cli
 *        To add symlinks simply use command: ln -s ../../relative-to-target/source/path target
 * ACTIONS:
 *      - build: replaces all symlinks in Config.rootDir with real files
 *      - clear: restores all previously replaced symlinks in Config.rootDir
 * @Author Daniel Kucal <dkucal@gmail.com> www.danielkucal.com
 */

let helper = new (Config.helperClass)(Config.rootDir);
let script = process.argv[2];
let scripts: any = {};

scripts.build = () => {
    console.log('Replacing symlinks by real files...');
    helper.findSymlinks(Config.rootDir).then(files => {
        if (!Object.keys(files).length) {
            console.warn('No single symlink was found! Did you mean to clear?');
            return;
        }
        helper.saveSymlinks(files);

        // TODO: Move to the helper class
        for (let file of Object.keys(files)) {
            let symlink = helper.getRelativePath(files[file]);
            helper.copyFile(symlink, file);
        }
    });
};

scripts.clear = () => {
    let symlinksPath = Config.rootDir + Config.symlinksFile;
    let savedSymlinks = helper.getSavedSymlinks();
    if (!savedSymlinks) {
        console.error('File ' + symlinksPath +
            ' doesn\'t exist! Did you mean to build?');
        process.exitCode = 1;
        return;
    }
    console.log('Restoring symlinks...');
    // TODO: move to the helper class
    Object.keys(savedSymlinks).forEach(file => {
        let symlink = savedSymlinks[file];
        child_process.execSync('rm -rf ' + file);
        child_process.execSync('ln -s ' + symlink + ' ' + file);
    });
    child_process.execSync('rm ' + symlinksPath);
};

if (script && typeof scripts[script] === 'function') {
    scripts[script]();
} else {
    console.error('USAGE: Please provide arguments in proper format: build|clear ./symlinks/path');
    process.exitCode = 1;
}
