/* BankShot engine: one-cushion bank and kick geometry on a pool table.
   Mirror method: reflect the target across the cushion, the straight line
   from origin to the mirrored target crosses the cushion at the aim point.
   Idealized: no spin, no cushion compression; real tables play shorter.
   Coordinates in diamonds: x in [0,8], y in [0,4] (9ft table). Pure JS. */
(function(root,factory){
  if(typeof module==='object'&&module.exports){module.exports=factory();}
  else{root.BankShot=factory();}
})(typeof self!=='undefined'?self:this,function(){
'use strict';
var W=8,H=4; /* table in diamonds */
var EPS=1e-9;
function round3(v){return Math.round(v*1000)/1000;}
/* reflect target across a cushion, intersect line origin->mirrored with cushion */
function bankOne(ox,oy,tx,ty,cushion){
  var mx=tx,my=ty,ok=true;
  if(cushion==='top')my=2*H-ty;
  else if(cushion==='bottom')my=-ty;
  else if(cushion==='left')mx=-tx;
  else if(cushion==='right')mx=2*W-tx;
  else return null;
  /* param line origin + t*(mirrored-origin); find t where it crosses cushion */
  var dx=mx-ox,dy=my-oy,t;
  if(cushion==='top'||cushion==='bottom'){
    if(Math.abs(dy)<EPS)return null;
    var yc=cushion==='top'?H:0;
    t=(yc-oy)/dy;
  }else{
    if(Math.abs(dx)<EPS)return null;
    var xc=cushion==='right'?W:0;
    t=(xc-ox)/dx;
  }
  if(t<=EPS||t>=1)return null; /* must cross cushion before mirrored target */
  var ax=ox+t*dx,ay=oy+t*dy;
  /* aim point must sit on the table edge */
  if(ax<-EPS||ax>W+EPS||ay<-EPS||ay>H+EPS)return null;
  var d1=Math.hypot(ax-ox,ay-oy),d2=Math.hypot(mx-ax,my-ay);
  /* incidence angle vs cushion normal, degrees */
  var nDotIn,nDotOut;
  var ux=(ax-ox)/d1,uy=(ay-oy)/d1;
  var vx=(tx-ax)/d2,vy=(ty-ay)/d2;
  var nx=cushion==='left'?1:cushion==='right'?-1:0;
  var ny=cushion==='top'?-1:cushion==='bottom'?1:0;
  var cosI=Math.abs(ux*nx+uy*ny),cosO=Math.abs(vx*nx+vy*ny);
  var aI=Math.acos(Math.min(1,cosI))*180/Math.PI;
  var aO=Math.acos(Math.min(1,cosO))*180/Math.PI;
  return {cushion:cushion,aim:{x:round3(ax),y:round3(ay)},
    travelIn:round3(d1),travelOut:round3(d2),
    angleIn:Math.round(aI*10)/10,angleOut:Math.round(aO*10)/10};
}
/* all four cushions, ranked by total path length */
function allBanks(ox,oy,tx,ty){
  var out=[];
  ['top','bottom','left','right'].forEach(function(c){
    var r=bankOne(ox,oy,tx,ty,c);
    if(r)out.push(r);
  });
  out.sort(function(a,b){return (a.travelIn+a.travelOut)-(b.travelIn+b.travelOut);});
  return out;
}
/* natural-angle kick: where to aim on a named cushion so the rebound reaches target */
function kick(ox,oy,tx,ty,cushion){return bankOne(ox,oy,tx,ty,cushion);}
/* validate a point is on the table */
function onTable(x,y){return x>=0&&x<=W&&y>=0&&y<=H;}
return {W:W,H:H,bankOne:bankOne,allBanks:allBanks,kick:kick,onTable:onTable};
});
