// @flow

declare module 'recursive-readdir' {
    declare type FileStatsType = {
        isDirectory: () => boolean,
    };

    declare type ReadDirRecursiveExcludeType = (pathToFile: string, stats: FileStatsType) => boolean;

    declare export default function readDirRecursive(
        pathToFolder: string,
        exclude: Array<ReadDirRecursiveExcludeType>,
    ): Promise<Array<string>>;
}
