import { ModuleConfig } from "./ModuleConfig";
import { Position } from "./Position";

export interface Module {
    module: string;
    position: string;
    header?: '';
    config: ModuleConfig;
    pos: Position;
}
