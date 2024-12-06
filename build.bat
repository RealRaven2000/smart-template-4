set /P smartTemplateRev=<revision.txt
set /a oldRev=%smartTemplateRev%
set /a smartTemplateRev+=1
powershell -Command "(gc -en UTF8 manifest.json) -replace 'pre%oldRev%', 'pre%smartTemplateRev%' | Out-File manifest.json -encoding utf8"
"C:\Program Files\7-Zip\7z" a -xr!.svn smartTemplateWeb.zip manifest.json _locales scripts html chrome locale popup st-background.* license.txt icon.png release-notes.html change-log.txt
echo %smartTemplateRev% > revision.txt
move smartTemplate-*.xpi "..\..\..\Test Versions\4.9.1\"
powershell -Command "Start-Sleep -m 270"
rename smartTemplateWeb.zip smartTemplate-fx-4.9.1pre%smartTemplateRev%.xpi