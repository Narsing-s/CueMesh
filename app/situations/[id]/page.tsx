"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, AlertTriangle, Clock3 } from "lucide-react";

type Situation={id:string;title:string;status:string;progress:number;documents:{id:string;name:string}[];events:{id:string;title:string;description?:string|null}[];actions:{id:string;title:string;status:string;dueAt?:string|null}[];missingItems:{id:string;label:string;reason?:string|null;resolved:boolean}[];insights:{id:string;title:string;detail:string;confidence?:number|null}[]};

export default function SituationPage({params}:{params:{id:string}}){
 const [data,setData]=useState<Situation|null>(null); const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/situations/"+params.id).then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error||"Unable to load");setData(j.situation)}).catch(e=>setError(e.message))},[params.id]);
 if(error)return <main className="detail"><Link href="/">← Back</Link><h1>Unable to load situation</h1><p>{error}</p></main>;
 if(!data)return <main className="detail"><Link href="/">← Back</Link><p>Loading situation…</p></main>;
 return <main className="detail"><Link href="/"><ArrowLeft size={16}/> Back</Link><header><div><span className="status"><span/> {data.status}</span><h1>{data.title}</h1><p>Situation completeness: <b>{data.progress}%</b></p></div></header>
 <section className="detailGrid">
  <article className="card"><h2><FileText size={18}/> Documents</h2>{data.documents.length?data.documents.map(x=><p key={x.id}>{x.name}</p>):<p className="muted">No documents yet.</p>}</article>
  <article className="card"><h2><AlertTriangle size={18}/> Missing items</h2>{data.missingItems.length?data.missingItems.map(x=><p key={x.id}>{x.resolved?"✓ ":"! "}{x.label}</p>):<p className="muted">No known gaps.</p>}</article>
  <article className="card"><h2><CheckCircle2 size={18}/> Actions</h2>{data.actions.length?data.actions.map(x=><p key={x.id}>{x.status}: {x.title}</p>):<p className="muted">No actions yet.</p>}</article>
  <article className="card"><h2><Clock3 size={18}/> Timeline</h2>{data.events.length?data.events.map(x=><p key={x.id}>{x.title}</p>):<p className="muted">No events yet.</p>}</article>
 </section>
 {data.insights.length>0&&<section className="card insights"><h2>Evidence-backed insights</h2>{data.insights.map(x=><div key={x.id}><b>{x.title}</b><p>{x.detail}</p></div>)}</section>}
 </main>;
}
