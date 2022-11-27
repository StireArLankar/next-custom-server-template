import fs from 'fs';
import path from 'path';

import zodToJsonSchema from 'zod-to-json-schema';

import { devopsConfigSchema } from './devops.zod';

const schema = zodToJsonSchema(devopsConfigSchema);

const _path = path.join(__dirname, 'devops.schema.json');
fs.writeFileSync(_path, JSON.stringify(schema));
