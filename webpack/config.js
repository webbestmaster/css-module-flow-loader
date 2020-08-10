/* global process */

/* eslint no-process-env: 0, id-match: 0, optimize-regex/optimize-regex: 0 */

const modeDevelopmentName = 'development';
const modeProductionName = 'production';

const nodeEnvironment = process.env.NODE_ENV || modeDevelopmentName;

// module.exports.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;
module.exports.isBuildServer = process.env.IS_BUILD_SERVER === 'YES';

module.exports.isDevelopment = nodeEnvironment === modeDevelopmentName;
module.exports.isProduction = nodeEnvironment === modeProductionName;

module.exports.cwd = process.cwd();

module.exports.fileRegExp = /\.(webp|png|jpg|jpeg|gif|svg|otf|ttf|woff2?)$/;

module.exports.pathToDist = '/dist-test';

module.exports.pathToStaticFileFolder = '/static';
module.exports.pathToLoadedFileFolder = '/file';

module.exports.webpackDevServerPort = 3333;
module.exports.ssrServerPort = 9091;
module.exports.ssrHttpServerPortProduction = 80;
module.exports.ssrHttpsServerPortProduction = 443;
