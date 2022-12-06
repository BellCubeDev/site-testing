$resp = Invoke-WebRequest -Uri "http://checkip.amazonaws.com/" -UseBasicParsing -ContentType "text/plain" -DisableKeepAlive
Write-Host $resp