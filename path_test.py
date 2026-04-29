import os

test_pdf = r'D:\东玄学习\韩少嵛真神论命真神论命法\配套资料\06、命宫十神的善凶论得失.pdf'
DOC_DIRS = [r'D:\东玄学习\韩少嵛真神论命真神论命法\配套资料', r'D:\东玄学习\林白亲传弟子班课\命理风水 韩元茗稿', r'D:\东玄学习\林白亲传弟子班课\文档资料']
VIDEO_DIRS = [r'D:\东玄学习\韩元茗60天命名解码营40集\白泽易经大讲堂 姓名学--名字识人到取名旺运10集', r'D:\东玄学习\韩元茗60天命名解码营40集\韩元茗《五行姓名学经典课程》（初级班 ）专栏 共三讲', r'D:\东玄学习\韩元茗60天命名解码营40集\韩元茗60天命名解码营40集', r'D:\东玄学习\韩少嵛真神论命真神论命法']
all_dirs = VIDEO_DIRS + DOC_DIRS

print('File:', test_pdf)
print('File dir:', os.path.dirname(test_pdf))
print()
for d in all_dirs:
    try:
        rel = os.path.relpath(test_pdf, d)
        starts = rel.startswith('..')
        print(f'  DIR: {d}')
        print(f'    relpath={rel}  starts_with_dotdot={starts}')
    except ValueError as e:
        print(f'  DIR: {d} -> ValueError')
