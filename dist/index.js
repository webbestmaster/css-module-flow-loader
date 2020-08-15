//

/* :: import {                                     } from 'node-sass'; */

const path = require('path');
const fileSystem = require('fs');

const readDirRecursive = require('recursive-readdir');
const nodeSass = require('node-sass');

const fileExtensionList = new Set(['.css', '.scss', '.sass']);
const excludeFolderList = new Set(['node_modules', '.git']);

function fileExclude(pathToFile, stats) {
    const filePathChunkList = new Set(pathToFile.split(path.sep));

    // eslint-disable-next-line no-loops/no-loops
    for (const excludeFolder of excludeFolderList) {
        if (filePathChunkList.has(excludeFolder)) {
            return true;
        }
    }

    if (stats.isDirectory()) {
        return false;
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

function rawClassNameToFlowProperty(rawClassName) {
    return `    +'${rawClassName.slice(1)}': string;`;
}

function getFlowTypeFileContent(classNameList) {
    const allClassNameList = classNameList.map(rawClassNameToFlowProperty);

    return templateWrapper.replace(classListReplaceValue, allClassNameList.join('\n'));
}

const removeCssCommentRegExpGlobal = /\/\*[\S\s]*?\*\//g;
const removeCssRuleRegExpGlobal = /{[\S\s]*?}/g;

function getCleanCssText(cssText) {
    return cssText.replace(removeCssCommentRegExpGlobal, '').replace(removeCssRuleRegExpGlobal, '');
}

function renderNodeSassCallback(sassRenderError, result) {
    if (sassRenderError || !result) {
        throw sassRenderError;
    }

    const cleanCssText = getCleanCssText(result.css.toString());

    const classNameList = [...new Set(cleanCssText.match(/\.[_a-z]+[\w-_]*/g) || [])].sort();

    function fileWriteCallback(fileWriteError) {
        if (fileWriteError) {
            throw fileWriteError;
        }
    }

    fileSystem.writeFile(result.stats.entry + '.flow', getFlowTypeFileContent(classNameList), fileWriteCallback);
}

function writeFlowType(pathToFile) {
    nodeSass.render({file: pathToFile}, renderNodeSassCallback);
}

module.exports = function cssModuleFlowLoader(source) {
    const rootPathFolder = this.rootContext;

    (async () => {
        const filePathList = await readDirRecursive(rootPathFolder, [fileExclude]);

        filePathList.forEach(writeFlowType);
    })();

    return source;
};
