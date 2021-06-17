/// <reference types="node" />
export declare type WebsocketDataFrame = {
    fin: boolean;
    rsv1: boolean;
    rsv2: boolean;
    rsv3: boolean;
    opcode: number;
    isMask: boolean;
    mask: number;
    payloadLenght: number;
    payloadData: Buffer;
};
//# sourceMappingURL=types.d.ts.map