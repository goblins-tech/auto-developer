const autoDeveloper = {
  config: {
    name: "my-project",
    path: "/my-project"
  },
  builders: [
    ["@goblins-tech/project-builder", {}],
    ["@goblins-tech/angular-builder", {}],
    ["@goblins-tech/material-builder", {}],
    ["@goblins-tech/express-builder", {}],
    ["@goblins-tech/mongodb-builder", {}]
  ]
};

export default autoDeveloper;
