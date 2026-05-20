Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "e:\vibe coding\ValoInsight"
WshShell.Run "cmd /c npm run dev", 0, False
Set WshShell = Nothing
