// @flow

declare module 'node-sass' {
    declare type NodeSassRenderDataType = {
        +file: string,
    };

    declare export type NodeSassRenderCallbackResultType = {
        css: Buffer,
        stats: {
            entry: string,
        },
    };

    declare type NodeSassRenderCallbackType = (
        sassRenderError: ?Error,
        result: ?NodeSassRenderCallbackResultType,
    ) => mixed;

    declare type NodeSassType = {
        +render: (data: NodeSassRenderDataType, callback: NodeSassRenderCallbackType) => mixed,
    };

    declare var nodeSass: NodeSassType;

    declare export default typeof nodeSass;
}
