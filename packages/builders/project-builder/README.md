# Project builder

> a builder for [autoDeveloper](https://github.com/xxyyzz2050/autoDeveloper) workflow, just add it to autoDeveloper.json file

# usage

```
[
'@eldeeb/project-builder'
]
```

or

```
[
  ['@eldeeb/project-builder', {/*options*/} ]
]
```

# commands

## init

initiates a workspace and creates some basic files such as package.json, .gitignore, tsconfig.json, ...

### Examples

```
//init a new project
[
  ['@eldeeb/project-builder', {
    name:"projectName",
    tsconfig:{/*tsconfig options, override project-builder's defaults*/},
    gitignore:['node_modules','dist'],
    npmignore:[],
    //and other package.json stuff
    } ]
]

```

### Options

- **name** project name, also applies by default for other builders such as @eldeeb/angular-builder if no other project name provided

- **info** project & author info

- **gitignore : [] | string**
  add or modify the default .gitignore entries

- **tsconfig** tsconfig options

# default options

```
{}
```
