import {Plugin} from 'vite';
import {makeZip} from "./zipUtils";

export default function AutoZip(folderPath: string, outPath?: string, outName?: string): Plugin;
export declare const zip: typeof makeZip;
