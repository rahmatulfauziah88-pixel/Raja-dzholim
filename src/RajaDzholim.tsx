import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from "remotion";

const scenes = [
 {start:0,duration:600,title:"RAJA DZOLIM",sub:"KETIKA KEKUASAAN MEMAKSA ULAMA TUNDUK",year:"218 H / 833 M",text:"Seorang khalifah merasa pendapatnya harus menjadi keyakinan seluruh umat.",art:"palace.svg"},
 {start:600,duration:840,title:"AL-MA'MUN",sub:"SURAT PERINTAH MIHNAH",year:"218 H",text:"Ia memerintahkan para hakim dan ahli hadis diuji: apakah Al-Qur'an makhluk? Penolakan berakibat kesaksian ditolak dan tekanan negara.",art:"decree.svg"},
 {start:1440,duration:840,title:"AL-MU'TASIM",sub:"IMAM AHMAD DICAMBUK",year:"220 H",text:"Al-Mu'tasim meneruskan kebijakan itu. Imam Ahmad bin Hanbal dipenjara dan dicambuk karena menolak mengucapkan bahwa Al-Qur'an adalah makhluk.",art:"prison.svg"},
 {start:2280,duration:660,title:"AL-WATHIQ",sub:"AHMAD BIN NASR DIEKSEKUSI",year:"231 H",text:"Ahmad bin Nasr al-Khuza'i ditangkap dan dihukum mati pada masa Al-Wathiq. Perbedaan pendapat berujung pada darah yang tertumpah.",art:"court.svg"},
 {start:2940,duration:660,title:"AL-MUTAWAKKIL",sub:"MIHNAH DIHENTIKAN",year:"234 H",text:"Pada masa Al-Mutawakkil, kebijakan Mihnah dihentikan. Kekuasaan berganti, tetapi catatan sejarah tetap tinggal.",art:"sunrise.svg"}
];
const gold="#d5ad68";
const Scene:React.FC<{s:typeof scenes[number]}> = ({s})=>{
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 const opacity=interpolate(f,[0,22,s.duration-22,s.duration],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const zoom=interpolate(f,[0,s.duration],[1,1.10],{easing:Easing.out(Easing.quad)});
 return <AbsoluteFill style={{backgroundColor:"#090b10",opacity,overflow:"hidden"}}>
  <AbsoluteFill style={{transform:`scale(${zoom})`}}><Img src={staticFile("art/"+s.art)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.68}}/></AbsoluteFill>
  <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(4,6,10,.95) 0%,rgba(4,6,10,.72) 52%,rgba(4,6,10,.18) 100%)"}}/>
  <div style={{position:"absolute",left:130,top:145,color:gold,fontFamily:"serif",fontSize:28,letterSpacing:8}}>{s.year}</div>
  <div style={{position:"absolute",left:130,top:280,width:1300}}>
   <div style={{fontFamily:"serif",fontSize:s.title==="RAJA DZOLIM"?100:82,fontWeight:700,color:"#f5eee1",lineHeight:1.05,textShadow:"0 5px 30px #000"}}>{s.title}</div>
   <div style={{marginTop:24,color:gold,fontSize:32,fontWeight:700,letterSpacing:3}}>{s.sub}</div>
   <div style={{marginTop:48,width:1120,color:"#f1eee8",fontSize:34,lineHeight:1.5,fontFamily:"Arial,sans-serif"}}>{s.text}</div>
  </div>
  <div style={{position:"absolute",left:130,right:130,bottom:82,height:3,background:"rgba(255,255,255,.22)"}}><div style={{height:3,width:`${Math.min(100,((f/s.duration)*100))}%`,background:gold}}/></div>
  <div style={{position:"absolute",right:130,bottom:105,color:"#b8b2a7",fontSize:18,letterSpacing:4}}>RAJA DZOLIM • DOKUMENTER SEJARAH</div>
 </AbsoluteFill>
};
export const RajaDzholim:React.FC=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill style={{backgroundColor:"#090b10"}}>
  {scenes.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><Scene s={s}/></Sequence>)}
  <Sequence from={0}><Audio src={staticFile("audio/narration.mp3")} volume={1}/></Sequence>
 </AbsoluteFill>
};
