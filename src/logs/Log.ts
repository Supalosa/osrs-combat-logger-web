export type LogLine = {
    date: string;
    tick: number;
    type: string;
    payload: any;
};

export enum LogTypes {
    LOG_INSTANCE_TEMPLATE = "LogInstanceTemplate",
    LOG_PLAYER_MOVED = "LogPlayerMoved",
}
