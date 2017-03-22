# thought-plugin-jsdoc 

[![NPM version](https://badge.fury.io/js/thought-plugin-jsdoc.svg)](http://badge.fury.io/js/thought-plugin-jsdoc)
[![Travis Build Status](https://travis-ci.org/nknapp/thought-plugin-jsdoc.svg?branch=master)](https://travis-ci.org/nknapp/thought-plugin-jsdoc)
[![Coverage Status](https://img.shields.io/coveralls/nknapp/thought-plugin-jsdoc.svg)](https://coveralls.io/r/nknapp/thought-plugin-jsdoc)

> Add jsdoc to your readme


# Installation

```
npm install thought-plugin-jsdoc
```

## Usage

In order to use this plugin for [thought](https://npmjs.com/package/thought),
first add it to the dev-dependencies of your project

```bash
npm install --save-dev 
```

You can then add a file `.thought/config.js` to your 
project, with the following contents.

```js
module.exports = {
  plugins: [
    'thought-plugin-jsdoc'
  ]
}

```


Thought will then add the jsdoc-comments of your main-file to the README.md

## Configuration 

This plugin applies the following configuration

### Partials
#### [api.md.hbs](src/partials/api.md.hbs)
    
```hbs
{{#if package.main}}
##  API-reference
{{#each (jsdoc package.main '#')}}
{{#if multipleFiles}}
    
### {{file}}
{{/if}}
{{markdown}}
{{/each}}

{{/if}}

```

### Helpers


#### `jsdoc(globPattern, headerPrefix)`

Use dox and doxme to create markdown from jsdoc-comments. This only works for javascript-files
Intended use

    {{#each (jsdoc globPattern)}}
    # {{filename}}

    {{jsdoc}}
    {{/each}}



#### Parameters

| parameter      | type   | description                                                                                        |
| -------------- | ------ | -------------------------------------------------------------------------------------------------- |
| `globPattern`  | string | a glob-pattern to find the files                                                                   |
| `headerPrefix` | string | a string such as '##' that is use as prefix for lines starting with '#' to reduced the header-size |



**Returns** `Array.<{ filename: string, jsdoc: string }>`, a jsdoc-string for each resolved file



```json
{
  "handlebars": {
    "partials": {
      "api.md.hbs": {
        "path": "src/partials/api.md.hbs",
        "contents": "{{#if package.main}}\n##  API-reference\n{{#each (jsdoc package.main '#')}}\n{{#if multipleFiles}}\n    \n### {{file}}\n{{/if}}\n{{markdown}}\n{{/each}}\n\n{{/if}}\n"
      }
    },
    "helpers": "/home/nknappmeier/projects/node-libraries/thought-plugin-jsdoc/src/helpers.js"
  },
  "_metadata": {
    "modules": [
      {
        "name": "thought-plugin-jsdoc",
        "version": "0.0.0",
        "description": "Add jsdoc to your readme",
        "repository": {
          "type": "git",
          "url": "git@github.com:nknapp/thought-plugin-jsdoc.git"
        },
        "homepage": "https://github.com/nknapp/thought-plugin-jsdoc",
        "author": {
          "name": "Nils Knappmeier",
          "email": "npm@knappi.org",
          "url": "https://github.com/nknapp"
        },
        "bugs": {
          "url": "https://github.com/nknapp/thought-plugin-jsdoc/issues"
        },
        "main": "src/index.js",
        "license": "MIT",
        "scripts": {
          "lint": "eslint --fix .",
          "test": "mocha && npm run lint",
          "coverage": "istanbul cover ./node_modules/.bin/_mocha --report lcovonly",
          "postcoverage": "istanbul check-coverage coverage/coverage.json --statements 100",
          "prethought": "thought --version || npm -g install thought",
          "thought": "thought run -a",
          "preversion": "thought --version || npm -g install thought",
          "version": "thoughtful changelog -o -a && npm run thought"
        },
        "dependencies": {
          "bluebird": "^3.5.0",
          "dox": "^0.9.0",
          "doxme": "^1.8.2",
          "glob": "^7.1.1"
        },
        "devDependencies": {
          "chai": "^3.5.0",
          "chai-as-promised": "^6.0.0",
          "customize": "^1.1.0",
          "customize-engine-handlebars": "^1.0.1",
          "dirty-chai": "^1.2.2",
          "eslint": "^3.17.1",
          "eslint-config-standard": "^7.0.1",
          "eslint-plugin-import": "^2.2.0",
          "eslint-plugin-node": "^4.2.1",
          "eslint-plugin-promise": "^3.5.0",
          "eslint-plugin-standard": "^2.1.1",
          "husky": "^0.13.2",
          "istanbul": "^0.4.5",
          "mocha": "^3.2.0",
          "thoughtful-release": "^0.3.1",
          "trace-and-clarify-if-possible": "^1.0.0"
        },
        "standard": {
          "ignore": [
            "test/fixtures/**"
          ]
        },
        "files": [
          "src"
        ],
        "keywords": []
      }
    ]
  }
}
```


##  API-reference

#### `path`

thought-plugin-jsdoc https://github.com/nknapp/thought-plugin-jsdoc
Copyright (c) 2017 Nils Knappmeier. 
Released under the MIT license.


#### `exports`

Describe your module here





## License

`thought-plugin-jsdoc` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


## Release-Notes
 
For release notes, see [CHANGELOG.md](CHANGELOG.md)
 
## Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).