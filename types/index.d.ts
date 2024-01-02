import {Plugin} from 'vite';
import {makeZip} from "./zipUtils";

export interface IPluginOptions {
    folderPath: string;
    outName: string;
    outPath: string;
}

export default function AutoZip(options?: IPluginOptions): Plugin;
export declare const zip: typeof makeZip;
