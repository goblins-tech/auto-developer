# Project Creator

> a builder for [The Creator](https://github.com/xxyyzz2050/creator) workflow, just add it to creator.json file

# usage

```
[
'@eldeeb/project-creator'
]
```

or

```
[
  ['@eldeeb/project-creator', {/*options*/} ]
]
```

# commands

## init

initiates a workspace and creates some basic files such as package.json, .gitignore, tsconfig.json, ...

### Examples

```
//init a new project
[
  ['@eldeeb/project-creator', {
    name:"projectName",
    tsconfig:{/*tsconfig options, override project-creator's defaults*/},
    gitignore:['node_modules','dist'],
    npmignore:[],
    //and other package.json stuff
    } ]
]

```

### Options

- **name** project name, also applies by default for other builders such as @eldeeb/angular-creator if no other project name provided

- **info** project & author info

- **gitignore : [] | string**
  add or modify the default .gitignore entries

- **tsconfig** tsconfig options

# default options

```
{}
```
