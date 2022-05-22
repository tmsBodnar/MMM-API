import { Position } from "./Position";

export interface Module {
    module: string;
    position: string;
    header?: string;
    config?: string;
    pos: Position;
}
