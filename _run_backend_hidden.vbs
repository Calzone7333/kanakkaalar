Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strPath
WshShell.Run "cmd /c java -jar backend/target/financial-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1", 0
Set WshShell = Nothing
