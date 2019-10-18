# autoDeveloper

If you want to create an application, just have a friendly chat with autoDeveloper to discuss with it what exactly you need, and it will immediately create the desired application for you.

autoDeveloper automatically create any type of applications with any programming language within seconds without any coding experience from the user.

autoDeveloper can create, for example:

- a full-stack website with any back-end language such as PHP or Node.js, and any front-end framework such as Angular, React, or Vue
- an Android application with Java or Kotlin.
- any application with any programming language, even if the user doesn't have any experience with that language.

This idea increases the productivity to the maximum level, within seconds the un-experienced user can create a great application.

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

# builders

autoDeveloper creates the application via builders, every builder do a very scoped task into the project and the user can control what this builder can do by it’s options or via builder’s plugins.

autoDeveloper controls the workflow, installing the proper builders and loading them, transferring messages between the builders, maintaining the virtual tree.

autoDeveloper create a virtual tree of the project’s dir, all builders modify the virtual tree and don’t modify any of physical files.
if any builder throwed an exception, the workflow will stop (or pause until the user select a suggested solution to fix the throwed exception) and no any modification will apply to the application.
This idea is good especially if the user want to modify an existing project.
autoDeveloper will not make any changes to the current project until all builders successfully finished their tasks, and then the final virtual tree is merged with the current project at once.
This feature ensure safety and speed the process.

autoDeveloper may use the AI to chat with the user in a natural human language, but it also uses simple commands to create the desired project‘s structure.
