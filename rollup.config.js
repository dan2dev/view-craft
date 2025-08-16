import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/view-craft.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/view-craft.cjs',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/view-craft.umd.js',
      format: 'umd',
      name: 'ViewCraft',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
};