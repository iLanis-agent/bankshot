/* BankShot tests: engine vs tests/expected.json (python oracle).
   Numeric compare with tolerance: JS rounds half-up, python half-even,
   which differs on exactly-representable halves (e.g. 3.3125). */
'use strict';
const fs=require('fs'),path=require('path');
const B=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
function close(a,b,t){return Math.abs(a-b)<=t;}
function bankEq(r,o){
  if(r===null||o===null)return r===null&&o===null;
  return r.cushion===o.cushion&&close(r.aim.x,o.aim.x,0.0015)&&close(r.aim.y,o.aim.y,0.0015)
    &&close(r.travelIn,o.travelIn,0.0015)&&close(r.travelOut,o.travelOut,0.0015)
    &&close(r.angleIn,o.angleIn,0.05)&&close(r.angleOut,o.angleOut,0.05);
}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it.o)+'->'+JSON.stringify(it.t)+' ';
  if(it.kind==='one'){
    const r=B.bankOne(it.o[0],it.o[1],it.t[0],it.t[1],it.cushion);
    if(bankEq(r,it.oracle))ok(); else bad(T+it.cushion,r,it.oracle);
  }else{
    const r=B.allBanks(it.o[0],it.o[1],it.t[0],it.t[1]);
    let good=r.length===it.oracle.length;
    if(good)for(let i=0;i<r.length;i++)if(!bankEq(r[i],it.oracle[i]))good=false;
    if(good)ok(); else bad(T+'all',r,it.oracle);
  }
}
const r=B.bankOne(1,1,7,3,'top');
if(r&&Math.abs(r.angleIn-r.angleOut)<0.05)pass++; else bad('angle equality',r.angleIn,r.angleOut);
if(B.onTable(0,0)&&B.onTable(8,4)&&!B.onTable(8.1,2)&&!B.onTable(-0.1,2))pass++; else bad('onTable','mismatch','bounds');
const ab=B.allBanks(2,2,6,2);
if(ab.every(x=>x.aim.y>=0&&x.aim.y<=4&&x.aim.x>=0&&x.aim.x<=8))pass++; else bad('aim bounds',ab,'on table');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
