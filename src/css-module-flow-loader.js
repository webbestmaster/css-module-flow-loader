// @flow

/* :: import {type NodeSassRenderCallbackResultType} from 'node-sass'; */

const path = require('path');
const fileSystem = require('fs');

const readDirRecursive = require('recursive-readdir');
const nodeSass = require('node-sass');

const fileExtensionList = new Set(['.css', '.scss', '.sass']);
const excludeFolderList = new Set(['node_modules', '.git']);

type FileStatsType = {
    isDirectory: () => boolean,
};

function fileExclude(pathToFile: string, stats: FileStatsType): boolean {
    if (stats.isDirectory()) {
        return false;
    }

    const filePathChunkList = new Set(pathToFile.split(path.sep));

    // eslint-disable-next-line no-loops/no-loops
    for (const excludeFolder of excludeFolderList) {
        if (filePathChunkList.has(excludeFolder)) {
            return true;
        }
    }

    const extname = path.extname(pathToFile);

    return !fileExtensionList.has(extname);
}

const classListReplaceValue = '{{class-list}}';

const templateWrapper = `// @flow strict
/* This file is automatically generated by css-module-flow-loader */
declare module.exports: {|
${classListReplaceValue}
|};
`;

function rawClassNameToFlowProperty(rawClassName: string): string {
    const className = rawClassName.replace(/[\s.:{]/g, '');

    return `    +'${className}': string;`;
}

function getFlowTypeFileContent(allRawClassNameList: Array<string>): string {
    const allClassNameList = [...new Set(allRawClassNameList)].map(rawClassNameToFlowProperty);

    const uniqClassNameList = [...new Set(allClassNameList)];

    return templateWrapper.replace(classListReplaceValue, uniqClassNameList.join('\n'));
}

function renderNodeSassCallback(sassRenderError: ?Error, result: ?NodeSassRenderCallbackResultType) {
    if (sassRenderError || !result) {
        throw sassRenderError;
    }

    const allRawClassNameList = result.css.toString().match(/\.([_a-z]+[\w-_]*)[\s#,.:>{]*/gim);

    if (!allRawClassNameList) {
        return;
    }

    const filePathFlowTyped = result.stats.entry + '.flow';

    function fileWriteCallback(fileWriteError: ?Error) {
        if (fileWriteError) {
            throw fileWriteError;
        }

        console.log('[css-module-flow-loader]:', filePathFlowTyped, 'has been updated.');
    }

    fileSystem.writeFile(filePathFlowTyped, getFlowTypeFileContent(allRawClassNameList), fileWriteCallback);
}

function writeFlowType(pathToFile: string) {
    nodeSass.render({file: pathToFile}, renderNodeSassCallback);
}

module.exports = function cssModuleFlowLoader(source: string): string {
    const rootPathFolder = this.rootContext;

    (async () => {
        const filePathList = await readDirRecursive(rootPathFolder, [fileExclude]);

        filePathList.forEach(writeFlowType);
    })();

    return source;
};
