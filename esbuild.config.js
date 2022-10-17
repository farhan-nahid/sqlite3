let makeAllPackagesExternalPlugin = {
  name: 'make-all-packages-external',
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

require('esbuild').build({
  entryPoints: ['index.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  outdir: 'build',
  plugins: [makeAllPackagesExternalPlugin],
});
