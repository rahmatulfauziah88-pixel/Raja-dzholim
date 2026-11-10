import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from "remotion";

type SceneData = {start:number;duration:number;title:string;sub:string;year:string;text:string;art:string;source:string;quote?:string};
const scenes:SceneData[] = [
 {start:0,duration:600,title:"RAJA DZOLIM",sub:"KETIKA KEKUASAAN MEMAKSA ULAMA TUNDUK",year:"218 H / 833 M",text:"Ketika seorang khalifah merasa berhak menentukan apa yang harus diyakini seluruh umat.",art:"palace.svg",source:"Pembuka • Dinasti Abbasiyah"},
 {start:600,duration:840,title:"AL-MA'MUN",sub:"PERINTAH MIHNAH",year:"218 H",text:"Ia memerintahkan para hakim dan ahli hadis diuji: apakah Al-Qur'an makhluk? Penolakan dapat berakibat kesaksian ditolak.",art:"decree.svg",source:"Al-Tabari, Tarikh al-Rusul wa al-Muluk, jilid 8, hlm. 631 • Al-Suyuti, Tarikh al-Khulafa, hlm. 489–490",quote:"كَتَبَ الْمَأْمُونُ إِلَى إِسْحَاقَ بْنِ إِبْرَاهِيمَ فِي امْتِحَانِ الْقُضَاةِ وَالْمُحَدِّثِينَ"},
 {start:1440,duration:840,title:"AL-MU'TASIM",sub:"IMAM AHMAD DICAMBUK",year:"220 H",text:"Al-Mu'tasim meneruskan kebijakan itu. Imam Ahmad bin Hanbal dipenjara dan dicambuk karena menolak menyatakan Al-Qur'an sebagai makhluk.",art:"prison.svg",source:"Al-Suyuti, Tarikh al-Khulafa, edisi Dar al-Minhaj, hlm. 522",quote:"سَلَكَ الْمُعْتَصِمُ مَا خَتَمَ الْمَأْمُونُ بِهِ عُمْرَهُ مِنِ امْتِحَانِ النَّاسِ بِخَلْقِ الْقُرْآنِ"},
 {start:2280,duration:660,title:"AL-WATHIQ",sub:"AHMAD BIN NASR DIEKSEKUSI",year:"231 H",text:"Ahmad bin Nasr al-Khuza'i ditangkap dan dihukum mati pada masa Al-Wathiq. Perbedaan pendapat berujung pada darah yang tertumpah.",art:"court.svg",source:"Al-Suyuti, Tarikh al-Khulafa, edisi Dar al-Minhaj, hlm. 529–530"},
 {start:2940,duration:660,title:"AL-MUTAWAKKIL",sub:"MIHNAH MULAI DIHENTIKAN",year:"234 H",text:"Pada masa Al-Mutawakkil, kebijakan Mihnah mulai dihentikan. Perubahan dan pembebasan berlangsung bertahap.",art:"sunrise.svg",source:"Al-Suyuti, Tarikh al-Khulafa, hlm. 529; Al-Tabari, jilid 9"}
];
const gold="#d5ad68";
const Scene:React.FC<{s:SceneData}> = ({s})=>{
 const f=useCurrentFrame();
 const opacity=interpolate(f,[0,22,s.duration-22,s.duration],[0,1,1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const zoom=interpolate(f,[0,s.duration],[1,1.10],{easing:Easing.out(Easing.quad)});
 return <AbsoluteFill style={{backgroundColor:"#090b10",opacity,overflow:"hidden"}}>
  <AbsoluteFill style={{transform:`scale(${zoom})`}}><Img src={staticFile("art/"+s.art)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:.68}}/></AbsoluteFill>
  <AbsoluteFill style={{background:"linear-gradient(90deg,rgba(4,6,10,.96) 0%,rgba(4,6,10,.76) 56%,rgba(4,6,10,.2) 100%)"}}/>
  <div style={{position:"absolute",left:130,top:120,color:gold,fontFamily:"serif",fontSize:26,letterSpacing:8}}>{s.year}</div>
  <div style={{position:"absolute",left:130,top:245,width:1400}}>
   <div style={{fontFamily:"serif",fontSize:s.title==="RAJA DZOLIM"?100:82,fontWeight:700,color:"#f5eee1",lineHeight:1.05,textShadow:"0 5px 30px #000"}}>{s.title}</div>
   <div style={{marginTop:24,color:gold,fontSize:32,fontWeight:700,letterSpacing:3}}>{s.sub}</div>
   <div style={{marginTop:42,width:1120,color:"#f1eee8",fontSize:32,lineHeight:1.48,fontFamily:"Arial,sans-serif"}}>{s.text}</div>
   {s.quote && <div style={{marginTop:28,padding:"20px 28px",width:1000,background:"rgba(213,173,104,.12)",borderLeft:"5px solid "+gold,color:"#f4e7cf",fontFamily:"serif",fontSize:34,textAlign:"right",direction:"rtl"}}>{s.quote}</div>}
  </div>
  <div style={{position:"absolute",left:130,right:130,bottom:100,color:"#d7c9b2",fontSize:17,letterSpacing:1.2,opacity:.9}}>{s.source}</div>
  <div style={{position:"absolute",left:130,right:130,bottom:75,height:2,background:"rgba(255,255,255,.2)"}}><div style={{height:2,width:`${Math.min(100,((f/s.duration)*100))}%`,background:gold}}/></div>
  <div style={{position:"absolute",right:130,bottom:42,color:"#b8b2a7",fontSize:15,letterSpacing:4}}>RAJA DZOLIM • DOKUMENTER SEJARAH</div>
 </AbsoluteFill>
};
export const RajaDzholim:React.FC=()=>{
 return <AbsoluteFill style={{backgroundColor:"#090b10"}}>
  {scenes.map((s,i)=><Sequence key={i} from={s.start} durationInFrames={s.duration}><Scene s={s}/></Sequence>)}
  <Sequence from={0}><Audio src={staticFile("audio/narration.mp3")} volume={1}/></Sequence>
 </AbsoluteFill>
};
