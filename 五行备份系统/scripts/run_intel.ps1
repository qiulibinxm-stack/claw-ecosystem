# run_intel.ps1 - set encoding BEFORE starting python
$env:PYTHONIOENCODING = "utf-8"
Set-Location 'C:\Users\Administrator\.qclaw\workspace-agent-cf443017\五行备份系统\scripts'
python '五行开源情报.py'
