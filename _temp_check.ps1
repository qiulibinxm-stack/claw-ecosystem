$r = Invoke-RestMethod 'https://api.github.com/repos/AIDC-AI/Pixelle-Video/releases/latest'
Write-Output "=== Pixelle-Video ==="
Write-Output $r.name
foreach($a in $r.assets) {
    Write-Output "$($a.name) | $([math]::Round($a.size/1MB))MB | $($a.browser_download_url)"
}

Write-Output ""
Write-Output "=== MoneyPrinterTurbo ==="
$r2 = Invoke-RestMethod 'https://api.github.com/repos/harry0703/MoneyPrinterTurbo/releases/latest'
Write-Output $r2.tag_name
foreach($a in $r2.assets) {
    Write-Output "$($a.name) | $([math]::Round($a.size/1MB))MB | $($a.browser_download_url)"
}

Write-Output ""
Write-Output "=== Vibe Coding Starter ==="
$r3 = Invoke-RestMethod 'https://api.github.com/repos/tangyuan-dev/vibe-coding-starter'
Write-Output "Stars: $($r3.stargazers_count)"
Write-Output "Clone: git clone $($r3.clone_url)"

Write-Output ""
Write-Output "=== Hermes Self-Evolution ==="
$r4 = Invoke-RestMethod 'https://api.github.com/repos/NousResearch/hermes-agent-self-evolution'
Write-Output "Stars: $($r4.stargazers_count)"
Write-Output "Clone: git clone $($r4.clone_url)"
