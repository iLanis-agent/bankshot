#!/usr/bin/env python3
"""BankShot oracle: independent python mirror-method recompute."""
import json, math, os

W, H = 8.0, 4.0
EPS = 1e-9

def bank_one(ox,oy,tx,ty,cushion):
    mx,my = tx,ty
    if cushion=='top': my = 2*H-ty
    elif cushion=='bottom': my = -ty
    elif cushion=='left': mx = -tx
    elif cushion=='right': mx = 2*W-tx
    else: return None
    dx,dy = mx-ox, my-oy
    if cushion in ('top','bottom'):
        if abs(dy) < EPS: return None
        yc = H if cushion=='top' else 0.0
        t = (yc-oy)/dy
    else:
        if abs(dx) < EPS: return None
        xc = W if cushion=='right' else 0.0
        t = (xc-ox)/dx
    if t <= EPS or t >= 1: return None
    ax,ay = ox+t*dx, oy+t*dy
    if ax < -EPS or ax > W+EPS or ay < -EPS or ay > H+EPS: return None
    d1 = math.hypot(ax-ox, ay-oy); d2 = math.hypot(mx-ax, my-ay)
    ux,uy = (ax-ox)/d1, (ay-oy)/d1
    vx,vy = (tx-ax)/d2, (ty-ay)/d2
    nx = 1 if cushion=='left' else (-1 if cushion=='right' else 0)
    ny = -1 if cushion=='top' else (1 if cushion=='bottom' else 0)
    aI = math.degrees(math.acos(min(1, abs(ux*nx+uy*ny))))
    aO = math.degrees(math.acos(min(1, abs(vx*nx+vy*ny))))
    return {'cushion': cushion, 'aim': {'x': round(ax,3), 'y': round(ay,3)},
            'travelIn': round(d1,3), 'travelOut': round(d2,3),
            'angleIn': round(aI,1), 'angleOut': round(aO,1)}

def all_banks(ox,oy,tx,ty):
    out = []
    for c in ('top','bottom','left','right'):
        r = bank_one(ox,oy,tx,ty,c)
        if r: out.append(r)
    out.sort(key=lambda r: r['travelIn']+r['travelOut'])
    return out

items = []
CASES = [(1,1,7,3),(2,2,6,2),(0.5,3.5,7.5,0.5),(4,2,4,3.5),(3,1,5,3),(8,0,0,4),(1,3,7,1)]
for ox,oy,tx,ty in CASES:
    items.append({'kind':'all','o':[ox,oy],'t':[tx,ty],'oracle':all_banks(ox,oy,tx,ty)})
    for c in ('top','bottom','left','right'):
        items.append({'kind':'one','o':[ox,oy],'t':[tx,ty],'cushion':c,
                      'oracle':bank_one(ox,oy,tx,ty,c)})
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': items}, open(out,'w'))
print('cases:', len(items))
