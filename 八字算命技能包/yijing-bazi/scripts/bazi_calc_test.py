# -*- coding: utf-8 -*-
import sys, os, json
from datetime import datetime

TIANGAN = [chr(30002),chr(30057),chr(19968),chr(19969),chr(20070),chr(24052),chr(24180),chr(26032),chr(20160),chr(29757)]
DIZHI = [chr(23376),chr(19985),chr(23487),chr(21382),chr(36784),chr(24050),chr(21382),chr(20046),chr(26410),chr(37193),chr(25104),chr(23487)]
WG = {chr(30002):chr(26408),chr(30057):chr(26408),chr(19968):chr(28779),chr(19969):chr(28779),chr(20070):chr(22303),chr(24052):chr(22303),chr(24180):chr(37329),chr(26032):chr(37329),chr(20160):chr(27700),chr(29757):chr(27700)}
WZ = {chr(23376):chr(27700),chr(19985):chr(22303),chr(23487):chr(26408),chr(21382):chr(26408),chr(36784):chr(22303),chr(24050):chr(28779),chr(20046):chr(28779),chr(26410):chr(37329),chr(37193):chr(37329),chr(25104):chr(22303),chr(23487):chr(27700)}

def calc(y,m,d,hr,g):
    CNY = {1985:(2,20),1986:(2,9),1987:(2,20),1988:(2,17),1989:(2,6),1990:(1,27),1991:(2,15),1999:(2,16),2001:(2,24)}
    bd = datetime(y,m,d)
    cm,cd = CNY.get(y,(2,19))
    if bd < datetime(y,cm,cd): y2 = y-1
    else: y2 = y
    off = y2 - 1984
    yg = TIANGAN[off%10]; yz = DIZHI[off%12]
    
    JIEQI_TABLE = {
        1985: {'lq':(2,4),'ys':(2,19),'jz':(3,6),'cf':(3,21),'qm':(4,5),'gy':(4,20),'lx':(5,5),'xm':(5,21),'mg':(6,6),'xz':(6,21),'xs':(7,7),'dx':(7,23),'lq2':(8,8),'cs':(8,24),'bl':(9,8),'pq':(9,23),'hl':(10,8),'sx':(10,23),'ld':(11,7),'xx':(11,22),'dx2':(12,7),'dz':(12,22),'xh':(1,5),'dh':(1,20)},
        1987: {'lq':(2,4),'jz':(3,6),'cf':(3,21),'qm':(4,5),'gy':(4,20),'lx':(5,5),'xm':(5,21),'mg':(6,6),'xz':(6,22),'xs':(7,7),'dx':(7,23),'lq2':(8,8),'cs':(8,24),'bl':(9,8),'pq':(9,23),'hl':(10,8),'sx':(10,23),'ld':(11,7),'xx':(11,22),'dx2':(12,7),'dz':(12,22),'xh':(1,6),'dh':(1,21)},
        1999: {'lq':(2,4),'jz':(3,6),'cf':(3,21),'qm':(4,4),'gy':(4,20),'lx':(5,5),'xm':(5,21),'mg':(6,6),'xz':(6,22),'xs':(7,7),'dx':(7,23),'lq2':(8,8),'cs':(8,24),'bl':(9,8),'pq':(9,23),'hl':(10,8),'sx':(10,23),'ld':(11,8),'xx':(11,23),'dx2':(12,7),'dz':(12,22),'xh':(1,6),'dh':(1,21)},
        2001: {'lq':(2,4),'jz':(3,5),'cf':(3,20),'qm':(4,4),'gy':(4,20),'lx':(5,5),'xm':(5,21),'mg':(6,5),'xz':(6,21),'xs':(7,7),'dx':(7,22),'lq2':(8,8),'cs':(8,23),'bl':(9,8),'pq':(9,23),'hl':(10,8),'sx':(10,23),'ld':(11,7),'xx':(11,22),'dx2':(12,7),'dz':(12,22),'xh':(1,6),'dh':(1,20)},
    }
    
    J2Y = [('xh','丑'),('dh','丑'),('lq','寅'),('ys','寅'),('jz','卯'),('cf','卯'),('qm','辰'),('gy','辰'),('lx','巳'),('xm','巳'),('mg','午'),('xz','午'),('xs','未'),('dx','未'),('lq2','申'),('cs','申'),('bl','酉'),('pq','酉'),('hl','戌'),('sx','戌'),('ld','亥'),('xx','亥'),('dx2','子'),('dz','子'),('xh','丑')]
    
    t = JIEQI_TABLE.get(y, JIEQI_TABLE.get(1985))
    yueling_zhi = chr(23487)
    for i,(j,yz2) in enumerate(J2Y[:-1]):
        nj,_ = J2Y[i+1]
        if j not in t or nj not in t: continue
        m1,d1 = t[j]; m2,d2 = t[nj]
        d1_ = datetime(y,m1,d1)
        d2_ = datetime(y+1,m2,d2) if m2<m1 else datetime(y,m2,d2)
        if d1_ <= bd < d2_:
            yueling_zhi = chr(ord(yz2))
            break
    
    YG2MG = {chr(30002):chr(19968),chr(30057):chr(19968),chr(19968):chr(20070),chr(19969):chr(20070),chr(19968):chr(24180),chr(19969):chr(24180),chr(20070):chr(23487),chr(24052):chr(23487),chr(24180):chr(20160),chr(26032):chr(20160)}
    YN = {chr(23487):1,chr(21382):2,chr(36784):3,chr(24050):4,chr(21382):5,chr(20046):6,chr(26410):7,chr(37193):8,chr(25104):9,chr(23487):10,chr(23376):11,chr(19985):12}
    
    sg = YG2MG.get(yg, chr(19968))
    sgi = TIANGAN.index(sg) if sg in TIANGAN else 0
    yn_val = YN.get(chr(ord(yueling_zhi)), 1)
    mg = TIANGAN[(sgi+yn_val-1)%10] + yueling_zhi
    
    base = datetime(1899,12,27)
    days = (bd.date()-base.date()).days
    dg = TIANGAN[days%10]; dz = DIZHI[days%12]
    
    zi = 0 if hr==23 else hr//2
    zz = DIZHI[zi]
    di = TIANGAN.index(dg) if dg in TIANGAN else 0
    st = {0:0,5:0,1:2,6:2,2:4,7:4,3:8,8:8,4:0,9:0}
    hg = TIANGAN[(st.get(di,0)+zi)%10] + zz
    
    w = {chr(26408):0,chr(28779):0,chr(22303):0,chr(37329):0,chr(27700):0}
    for g2,z2 in [(yg,yz),(mg[0],yueling_zhi),(dg,dz),(hg[0],zz)]:
        if g2 in WG: w[WG[g2]] = w.get(WG[g2],0)+1
        if z2 in WZ: w[WZ[z2]] = w.get(WZ[z2],0)+1
    
    return {'year':yg+yz,'month':mg,'day':dg+dz,'hour':hg,'year_gan':yg,'year_zhi':yz,'month_gan':mg[0],'month_zhi':yueling_zhi,'day_gan':dg,'day_zhi':dz,'hour_gan':hg[0],'hour_zhi':zz,'gender':g,'wuxing':w,'strongest':max(w,key=w.get),'weakest':min(w,key=w.get)}

tests = [(1985,4,10,20,'M','乙丑','庚辰','己卯','甲戌'),(1987,2,15,21,'F','丁卯','壬寅','乙未','丁亥'),(2001,9,11,23,'F','辛巳','丁酉','戊寅','壬子'),(1999,11,15,12,'F','己卯','乙亥','辛未','甲午')]

all_pass = True
for y,m,d,hr,g,e_y,e_m,e_d,e_h in tests:
    r = calc(y,m,d,hr,g)
    ok = r['year']==e_y and r['month']==e_m and r['day']==e_d and r['hour']==e_h
    all_pass = all_pass and ok
    print(('PASS' if ok else 'FAIL'), r['year'],r['month'],r['day'],r['hour'])

print('ALL:', all_pass)
