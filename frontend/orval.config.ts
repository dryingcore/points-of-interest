import { defineConfig } from 'orval';

export default defineConfig({
  poi: {
    input: 'http://localhost:8888/swagger',
    output: {
      mode: 'split',
      target: 'src/api/endpoints/poi.ts',
      schemas: 'src/api/model',
      client: 'axios',
    },
  },
});
