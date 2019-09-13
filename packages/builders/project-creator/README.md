# Project Creator

> This package is a part of [The Creator](https://github.com/xxyyzz2050/creator) workflow, just add it to creator.json file

initiates a workspace and creates some basic files such as package.json, .gitignore, tsconfig.json, ...

# Example

```
[
  ['@eldeeb/project-creator', {/*options*/} ]
]
```

or

```
[
'@eldeeb/project-creator' //just use the default options
]
```

# Options

- **name** project name, also applies by default for other builders such as @eldeeb/angular-creator if no other project name provided

- **info** project & author info

- **gitignore : [] | string**
  add or modify the default .gitignore entries

- **ts** tsconfig options

# default options

```
{}
```
