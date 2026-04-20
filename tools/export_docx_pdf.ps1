$docx = "C:\Users\Jatin\Desktop\final project\docs\generated\College_Placement_Readiness_and_Gap_Analysis_Documentation.docx"
$pdf = "C:\Users\Jatin\Desktop\final project\docs\generated\rendered\College_Placement_Readiness_and_Gap_Analysis_Documentation.pdf"
New-Item -ItemType Directory -Force -Path (Split-Path $pdf) | Out-Null
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($docx)
$doc.ExportAsFixedFormat($pdf, 17)
$doc.Close($false)
$word.Quit()
Get-Item $pdf | Select-Object FullName,Length
