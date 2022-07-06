import { ModuleConfig } from './ModuleConfig';
import { Position } from './Position';

export interface Module {
  module: string;
  position: string;
  header?: string;
  config: ModuleConfig;
  pos?: Position;
}
