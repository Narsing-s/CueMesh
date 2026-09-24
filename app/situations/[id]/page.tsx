"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, AlertTriangle, Clock3, Upload, Plus, Bell, X, Check, CircleX } from "lucide-react";

type Situation={id:string;title:string;status:string;progress:number;documents:{id:string;name:string;mimeType?:string;sizeBytes?:number}[];events:{id:string;title:string;description?:string|null}[];actions:{id:string;title:string;status:string;dueAt?:string|null}[];missingItems:{id:string;label:string;reason?:string|null;resolved:boolean}[];insights:{id:string;title:string;detail:string;confidence?:number|null}[]};

export default function SituationPage({params}:{params:{id:string}}){
 const [data,setData]=useState<Situation|null>(null);
 const [error,setError]=useState("");
 const [uploading,setUploading]=useState(false);
 const [uploadError,setUploadError]=useState("");
 const [message,setMessage]=useState("");
 const [actionTitle,setActionTitle]=useState("");
 const [followTitle,setFollowTitle]=useState("");
 const [followWhen,setFollowWhen]=useState("");
 const fileRef=useRef<HTMLInputElement>(null);

 const load=async()=>{
   try{const r=await fetch("/api/situations/"+params.id,{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j.error||"Unable to load");setData(j.situation);setError("")}
   catch(e:any){setError(e.message||"Unable to load")}
 };
 useEffect(()=>{load()},[params.id]);

 const upload=async(file:File)=>{
   setUploading(true);setUploadError("");setMessage("");
   try{
     const form=new FormData();form.append("file",file);form.append("situationId",params.id);
     const r=await fetch("/api/documents",{method:"POST",body:form});const j=await r.json();
     if(!r.ok)throw new Error(j.error||"Upload failed");
     setMessage("Document uploaded successfully."); await load();
   }catch(e:any){setUploadError(e.message||"Upload failed")}
   finally{setUploading(false);if(fileRef.current)fileRef.current.value=""}
 };

 const createAction=async()=>{
   if(!actionTitle.trim())return;
   const r=await fetch("/api/situations/"+params.id+"/actions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title:actionTitle})});
   const j=await r.json(); if(!r.ok){setUploadError(j.error||"Could not create action");return}
   setActionTitle("");setMessage("Follow-up action created.");await load();
 };

 const actionUpdate=async(id:string,kind:"approve"|"reject"|"complete")=>{
   const r=await fetch("/api/actions/"+id+"/"+kind,{method:"POST"});const j=await r.json();
   if(!r.ok){setUploadError(j.error||"Action update failed");return}
   setMessage("Action updated.");await load();
 };

 const scheduleFollowUp=async()=>{
   if(!followTitle.trim()||!followWhen)return;
   const r=await fetch("/api/notifications",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
     situationId:params.id,title:followTitle.trim(),body:"CueMesh follow-up reminder",scheduledFor:new Date(followWhen).toISOString(),channel:"in-app"
   })});
   const j=await r.json();if(!r.ok){setUploadError(j.error||"Could not schedule follow-up");return}
   setFollowTitle("");setFollowWhen("");setMessage("Follow-up reminder scheduled.");await load();
 };

 const resolveGap=async(id:string,resolved:boolean)=>{
   const r=await fetch("/api/missing-items/"+id,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({resolved})});
   if(!r.ok){const j=await r.json();setUploadError(j.error||"Could not update gap");return} await load();
 };

 if(error)return <main className="detail"><Link href="/">← Back</Link><h1>Unable to load situation</h1><p>{error}</p></main>;
 if(!data)return <main className="detail"><Link href="/">← Back</Link><p>Loading situation…</p></main>;

 return <main className="detail">
  <Link href="/" className="back"><ArrowLeft size={16}/> Back</Link>
  <header><div><span className="status"><span/> {data.status}</span><h1>{data.title}</h1><p>Situation completeness: <b>{data.progress}%</b></p></div></header>

  <section className="card" style={{marginBottom:16}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
    <div><h2><Upload size={18}/> Documents</h2><p className="muted">Upload PDF, DOCX, TXT, PNG or JPG files up to 10 MB.</p></div>
    <button className="primary" disabled={uploading} onClick={()=>fileRef.current?.click()}><Upload size={16}/>{uploading?"Uploading…":"Upload document"}</button>
    <input ref={fileRef} hidden type="file" accept=".pdf,.docx,.txt,.png,.jpg,.jpeg" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}}/>
   </div>
   {uploadError&&<p className="warning">{uploadError}</p>}{message&&<p>{message}</p>}
   {data.documents.length?data.documents.map(x=><div key={x.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}><span><FileText size={15}/> {x.name}</span><span className="muted">{x.sizeBytes?Math.ceil(x.sizeBytes/1024)+" KB":""}</span></div>):<p className="muted">No documents yet.</p>}
  </section>

  <section className="detailGrid">
   <article className="card"><h2><AlertTriangle size={18}/> Missing items</h2>{data.missingItems.length?data.missingItems.map(x=><div key={x.id} style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><p>{x.resolved?"✓ ":"! "}{x.label}</p><button className="ghost" onClick={()=>resolveGap(x.id,!x.resolved)}>{x.resolved?"Reopen":"Resolve"}</button></div>):<p className="muted">No known gaps.</p>}</article>

   <article className="card"><h2><CheckCircle2 size={18}/> Follow-up actions</h2>
    <div style={{display:"flex",gap:8}}><input value={actionTitle} onChange={e=>setActionTitle(e.target.value)} placeholder="Add an action"/><button className="secondary" onClick={createAction}><Plus size={15}/> Add</button></div>
    {data.actions.length?data.actions.map(x=><div key={x.id} style={{padding:"10px 0",borderBottom:"1px solid var(--line, #ddd)"}}><b>{x.title}</b><p className="muted">{x.status}</p><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{x.status==="PROPOSED"&&<><button className="secondary" onClick={()=>actionUpdate(x.id,"approve")}><Check size={14}/> Approve</button><button className="ghost" onClick={()=>actionUpdate(x.id,"reject")}><X size={14}/> Reject</button></>}{(x.status==="APPROVED"||x.status==="IN_PROGRESS")&&<button className="secondary" onClick={()=>actionUpdate(x.id,"complete")}><CheckCircle2 size={14}/> Complete</button>}</div></div>):<p className="muted">No follow-up actions yet.</p>}
   </article>

   <article className="card"><h2><Bell size={18}/> Follow-up reminder</h2><input value={followTitle} onChange={e=>setFollowTitle(e.target.value)} placeholder="Reminder title"/><input type="datetime-local" value={followWhen} onChange={e=>setFollowWhen(e.target.value)} style={{marginTop:8}}/><button className="primary full" onClick={scheduleFollowUp} style={{marginTop:8}}>Schedule follow-up</button></article>

   <article className="card"><h2><Clock3 size={18}/> Timeline</h2>{data.events.length?data.events.map(x=><p key={x.id}>{x.title}</p>):<p className="muted">No events yet.</p>}</article>
  </section>

  {data.insights.length>0&&<section className="card insights"><h2>Evidence-backed insights</h2>{data.insights.map(x=><div key={x.id}><b>{x.title}</b><p>{x.detail}</p></div>)}</section>}
 </main>;
}
