# 查找今天修改过的.openclaw文件
Get-ChildItem "C:\Users\Administrator\.openclaw" -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt [datetime]"2026-04-27" } | Select-Object FullName, LastWriteTime, Length | Format-Table -AutoSize

Write-Host ""
Write-Host "=== 查看Gateway日志 ==="
$logPaths = @(
    "C:\Users\Administrator\.openclaw\logs",
    "C:\Users\Administrator\AppData\Local\QClaw\logs",
    "C:\Users\Administrator\AppData\Roaming\QClaw\logs"
)
foreach ($p in $logPaths) {
    if (Test-Path $p) {
        Write-Host "Found: $p"
        Get-ChildItem $p -ErrorAction SilentlyContinue | Select-Object Name, Length, LastWriteTime
    } else {
        Write-Host "Not found: $p"
    }
}
