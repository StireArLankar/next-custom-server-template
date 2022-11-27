import fs from 'fs';
import path from 'path';

import zodToJsonSchema from 'zod-to-json-schema';

import { managerConfigSchema } from './manager.zod';

const schema = zodToJsonSchema(managerConfigSchema);

const _path = path.join(__dirname, 'manager.schema.json');
fs.writeFileSync(_path, JSON.stringify(schema));
