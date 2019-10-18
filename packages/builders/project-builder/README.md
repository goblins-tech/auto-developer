# Project builder

> a builder for [autoDeveloper](https://github.com/goblins-tech/autoDeveloper) workflow, just add it to autoDeveloper.json file

# commands

## init

initiates a workspace and creates some basic files such as package.json, .gitignore, tsconfig.json, ...

### Examples

```
//init a new project

autoDeveloper = {
  config:{
    path: "/my-project"
  },
  builders:[
    ['@goblins-tech/project-builder', {
      tsconfig:{/* override project-builder's default tsconfig options*/},
      gitignore:['node_modules','dist'],
      npmignore:[],
      //and other package.json stuff
      } ]
  ]
}

```

### Options

- **name** project name, also applies by default for other builders such as @goblins-tech/angular-builder if no other project name provided

- **info** project & author info

- **gitignore : [] | string**
  add or modify the default .gitignore entries

- **tsconfig** tsconfig options

# default options

```
{}
```
