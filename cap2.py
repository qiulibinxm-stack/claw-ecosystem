import ctypes
import ctypes.wintypes

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32

width = user32.GetSystemMetrics(0)
height = user32.GetSystemMetrics(1)

hdesktop = user32.GetDesktopWindow()
hdc = user32.GetDC(hdesktop)
hdcMem = gdi32.CreateCompatibleDC(hdc)
hbmp = gdi32.CreateCompatibleBitmap(hdc, width, height)
gdi32.SelectObject(hdcMem, hbmp)
gdi32.BitBlt(hdcMem, 0, 0, width, height, hdc, 0, 0, 0x00CC0020)

class BITMAPINFOHEADER(ctypes.Structure):
    _fields_ = [
        ('biSize', ctypes.c_uint32),
        ('biWidth', ctypes.c_int32),
        ('biHeight', ctypes.c_int32),
        ('biPlanes', ctypes.c_uint16),
        ('biBitCount', ctypes.c_uint16),
        ('biCompression', ctypes.c_uint32),
        ('biSizeImage', ctypes.c_uint32),
        ('biXPelsPerMeter', ctypes.c_long),
        ('biYPelsPerMeter', ctypes.c_long),
        ('biClrUsed', ctypes.c_uint32),
        ('biClrImportant', ctypes.c_uint32),
    ]

bmi = BITMAPINFOHEADER()
bmi.biSize = ctypes.sizeof(BITMAPINFOHEADER)
bmi.biWidth = width
bmi.biHeight = -height
bmi.biPlanes = 1
bmi.biBitCount = 32
bmi.biCompression = 0

buf_size = width * height * 4
buf = (ctypes.c_char * buf_size)()
gdi32.GetDIBits(hdcMem, hbmp, 0, height, buf, ctypes.byref(bmi), 0)

from PIL import Image
import numpy as np

arr = np.frombuffer(buf, dtype=np.uint8).reshape((height, width, 4))
img = Image.fromarray(arr[:, :, :3], 'RGB')
img.save('C:\\temp\\screen.jpg', 'JPEG', quality=85)
print(f"Saved: {img.size}")

gdi32.DeleteObject(hbmp)
gdi32.DeleteDC(hdcMem)
user32.ReleaseDC(hdesktop, hdc)