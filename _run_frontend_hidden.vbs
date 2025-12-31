Set WshShell = CreateObject("WScript.Shell")
strPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strPath & "\frontend"
WshShell.Run "cmd /c npx vite preview --host --port 5173 >> ..\frontend.log 2>&1", 0
Set WshShell = Nothing
