import * as child_process from 'child_process';
import { promisify } from 'util';

export const runProcess = promisify(child_process.exec);
