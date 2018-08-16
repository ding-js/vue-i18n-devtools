const fs = require('fs');
const babel = require('rollup-plugin-babel');
const rollup = require('rollup');
const replace = require('rollup-plugin-replace');
const uglify = require('uglify-js');

const entries = [
  {
    format: 'cjs',
    file: './lib/index.common.js'
  },
  {
    format: 'es',
    file: './lib/index.esm.js'
  },
  {
    format: 'umd',
    name: 'VueI18nDevTools',
    file: './lib/index.js',
    env: 'production'
  },
  {
    format: 'umd',
    name: 'VueI18nDevTools',
    file: './lib/index.min.js',
    env: 'development'
  }
];

async function build(outputOptions) {
  const inputOptions = {
    input: './src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        externalHelpers: true
      })
    ]
  };

  if (outputOptions.env) {
    inputOptions.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(outputOptions.env)
      })
    );

    delete outputOptions.env;
  }

  const bundle = await rollup.rollup(inputOptions);
  const { code } = await bundle.generate(Object.assign({}, outputOptions));
  let result = code;
  if (/min\.js$/.test(outputOptions.file)) {
    result = uglify.minify(code, {
      output: {
        ascii_only: true
      },
      compress: {
        pure_funcs: ['makeMap']
      }
    }).code;
  }

  fs.writeFileSync(outputOptions.file, result, 'utf8');
}

entries.reduce((chain, e) => {
  return chain.then(() => {
    return build(e);
  });
}, Promise.resolve());
