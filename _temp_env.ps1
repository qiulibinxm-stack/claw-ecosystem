[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Get-PSDrive C | ForEach-Object { 
    $u = [math]::Round($_.Used/1GB,1)
    $f = [math]::Round($_.Free/1GB,1)
    Write-Output "C: ${u}GB used, ${f}GB free"
}

Write-Output ""
Write-Output "=== GPU ==="
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader 2>&1

Write-Output ""
Write-Output "=== Ollama ==="
$resp = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 3 -ErrorAction SilentlyContinue
if ($resp) {
    ($resp.Content | ConvertFrom-Json).models | ForEach-Object { 
        Write-Output "  $($_.name)"
    }
} else {
    Write-Output "  NOT_RUNNING"
}

Write-Output ""
Write-Output "=== DeepSeek Config ==="
$config = Get-Content 'C:\Users\Administrator\.qclaw\openclaw.json' -Raw -ErrorAction SilentlyContinue
if ($config) {
    $j = $config | ConvertFrom-Json
    $props = $j.models.providers.PSObject.Properties
    $ds = $props | Where-Object { $_.Name -like '*deepseek*' }
    if ($ds) {
        Write-Output "  Provider: $($ds.Name)"
        $v = $ds.Value
        Write-Output "  apiKey: $($v.apiKey)"
        Write-Output "  model: $($v.model)"
        Write-Output "  baseUrl: $($v.baseUrl)"
    } else {
        Write-Output "  DeepSeek NOT_FOUND"
    }
}
