::npm run build
schematics ./packages/builders/project-creator:project-creator --dry-run=true
pause
::use --dry-run=false to physically create the files

:: or from 'project-creator' dir: >schematics .:project-creator