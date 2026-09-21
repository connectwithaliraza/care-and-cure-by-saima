import * as migration_20260915_080945 from './20260915_080945';
import * as migration_20260915_152207 from './20260915_152207';
import * as migration_20260915_155024 from './20260915_155024';
import * as migration_20260915_180334 from './20260915_180334';
import * as migration_20260915_181903 from './20260915_181903';
import * as migration_20260915_182406 from './20260915_182406';
import * as migration_20260917_080632 from './20260917_080632';
import * as migration_20260917_081657 from './20260917_081657';
import * as migration_20260920_203656 from './20260920_203656';
import * as migration_20260920_205030 from './20260920_205030';
import * as migration_20260920_205435 from './20260920_205435';
import * as migration_20260920_212049 from './20260920_212049';

export const migrations = [
  {
    up: migration_20260915_080945.up,
    down: migration_20260915_080945.down,
    name: '20260915_080945',
  },
  {
    up: migration_20260915_152207.up,
    down: migration_20260915_152207.down,
    name: '20260915_152207',
  },
  {
    up: migration_20260915_155024.up,
    down: migration_20260915_155024.down,
    name: '20260915_155024',
  },
  {
    up: migration_20260915_180334.up,
    down: migration_20260915_180334.down,
    name: '20260915_180334',
  },
  {
    up: migration_20260915_181903.up,
    down: migration_20260915_181903.down,
    name: '20260915_181903',
  },
  {
    up: migration_20260915_182406.up,
    down: migration_20260915_182406.down,
    name: '20260915_182406',
  },
  {
    up: migration_20260917_080632.up,
    down: migration_20260917_080632.down,
    name: '20260917_080632',
  },
  {
    up: migration_20260917_081657.up,
    down: migration_20260917_081657.down,
    name: '20260917_081657',
  },
  {
    up: migration_20260920_203656.up,
    down: migration_20260920_203656.down,
    name: '20260920_203656',
  },
  {
    up: migration_20260920_205030.up,
    down: migration_20260920_205030.down,
    name: '20260920_205030',
  },
  {
    up: migration_20260920_205435.up,
    down: migration_20260920_205435.down,
    name: '20260920_205435',
  },
  {
    up: migration_20260920_212049.up,
    down: migration_20260920_212049.down,
    name: '20260920_212049'
  },
];
