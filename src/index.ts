import * as fs from 'fs';

import { parseInput } from './input';
import { formatOutput } from './output';
import { compute } from './compute';

if (require.main === module) {
  const filename = process.argv[2];
  try {
    const input = filename ? fs.readFileSync(filename, 'utf8') : fs.readFileSync(0, 'utf8');
    const parsed = parseInput(input);
    const result = compute(parsed.base, parsed.packages, parsed.vehicles);
    console.log(formatOutput(result));
  } catch (err: any) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}