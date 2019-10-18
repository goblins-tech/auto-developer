::npm run build
schematics ./packages/builders/project-builder:project-builder --dry-run=true
pause
::use --dry-run=false to physically create the files

:: or from 'project-builder' dir: >schematics .:project-builder