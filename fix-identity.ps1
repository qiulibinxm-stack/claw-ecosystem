$oc = Get-Content 'C:\Users\Administrator\.openclaw\identity\device-auth.json' -Raw | ConvertFrom-Json
$qc = Get-Content 'C:\Users\Administrator\.qclaw\identity\device-auth.json' -Raw | ConvertFrom-Json

Write-Host "OC scopes:" ($oc.tokens.operator.scopes -join ",")
Write-Host "QC before:" ($qc.tokens.operator.scopes -join ",")

$qc.tokens.operator = @{
    token = $oc.tokens.operator.token
    role = 'operator'
    scopes = $oc.tokens.operator.scopes
    updatedAtMs = [long](Get-Date -UFormat '%s') * 1000
}

$newJson = $qc | ConvertTo-Json -Depth 10
Set-Content 'C:\Users\Administrator\.qclaw\identity\device-auth.json' -Value $newJson -Encoding UTF8

$v = Get-Content 'C:\Users\Administrator\.qclaw\identity\device-auth.json' -Raw | ConvertFrom-Json
Write-Host "QC after:" ($v.tokens.operator.scopes -join ",")
Write-Host "Done!"
