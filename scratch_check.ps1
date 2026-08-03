Add-Type -AssemblyName System.Drawing

$inputPath = "c:\xampp\htdocs\sd-negeri-mulyoagung-1\src\assets\logo.png"
$outputPath = "c:\xampp\htdocs\sd-negeri-mulyoagung-1\src\assets\logo.png"

$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)
$width = $bmp.Width
$height = $bmp.Height

Write-Host "Image size: $width x $height"

# Create a new bitmap with ARGB format
$newBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$whiteThreshold = 240

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if pixel is near white
        if ($c.R -ge $whiteThreshold -and $c.G -ge $whiteThreshold -and $c.B -ge $whiteThreshold) {
            # Make pixel transparent
            $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            $newBmp.SetPixel($x, $y, $c)
        }
    }
}

$bmp.Dispose()
$newBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newBmp.Dispose()

Write-Host "Processed logo background transparency successfully."
