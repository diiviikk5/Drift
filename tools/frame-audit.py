"""Count repeated frames during motion (judder) in a video: python tools/frame-audit.py file.mp4 [...]
Needs opencv-python. A "stutter" is a frame identical to the previous one while both neighbours move."""
import cv2, numpy as np, sys
for p in sys.argv[1:]:
    cap=cv2.VideoCapture(p); fps=cap.get(5); prev=None; d=[]
    while True:
        ok,f=cap.read()
        if not ok: break
        g=cv2.resize(cv2.cvtColor(f,cv2.COLOR_BGR2GRAY),(480,270)).astype(np.int16)
        if prev is not None: d.append(np.abs(g-prev).mean())
        prev=g
    d=np.array(d); moving=d>0.3
    stutter=[i for i in range(1,len(d)-1) if d[i]<0.05 and d[i-1]>0.3 and d[i+1]>0.3]
    print(p.split('/')[-1][:40], 'frames',len(d)+1,'moving',moving.sum(),'stutters',len(stutter), 'rate %.0f%%'%(100*len(stutter)/max(1,moving.sum())), [round(i/fps,2) for i in stutter[:12]])
