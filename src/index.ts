import * as fs from 'fs';

import { parseInput } from './inputParser';
import { formatOutput } from './outputGenerator';
import { compute } from './core/index';

if (require.main === module) {
  const filename = process.argv[2];
  try {
    //  if file namenis passed or reading from STDIN
    const input = filename ? fs.readFileSync(filename, 'utf8') : fs.readFileSync(0, 'utf8');
    const parsed = parseInput(input);
    const result = compute(parsed.base, parsed.packages, parsed.vehicles);
    console.log(formatOutput(result));
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}