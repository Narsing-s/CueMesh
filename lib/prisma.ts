type Row = Record<string, any>;

const state: Record<string, Row[]> = Object.create(null);
const now = () => new Date();
const id = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const models = [
  "user","situation","situationMember","document","documentVersion","documentChunk","citation",
  "event","action","actionEvidence","actionDependency","insight","missingItem","entity",
  "situationEntity","entityRelationship","aiRun","notification","playbook","playbookStep",
  "job","situationReplay","consent","auditEvent"
];
for (const m of models) state[m] = [];

const relations: Record<string, Record<string, [string,string,string]>> = {
  situation: {
    members:["situationMember","situationId","id"], documents:["document","situationId","id"],
    events:["event","situationId","id"], actions:["action","situationId","id"],
    insights:["insight","situationId","id"], missingItems:["missingItem","situationId","id"],
    entities:["situationEntity","situationId","id"], notifications:["notification","situationId","id"],
    jobs:["job","situationId","id"], replays:["situationReplay","situationId","id"],
    consents:["consent","situationId","id"]
  },
  user: {
    situations:["situationMember","userId","id"], documents:["document","ownerId","id"],
    actions:["action","assigneeId","id"], notifications:["notification","userId","id"], consents:["consent","userId","id"]
  },
  document: {
    versions:["documentVersion","documentId","id"], chunks:["documentChunk","documentId","id"],
    citations:["citation","documentId","id"]
  },
  action: {
    evidence:["actionEvidence","actionId","id"],
    dependencies:["actionDependency","actionId","id"],
    dependents:["actionDependency","dependsOnActionId","id"]
  },
  playbook: { steps:["playbookStep","playbookId","id"] },
  entity: {
    situations:["situationEntity","entityId","id"],
    outgoing:["entityRelationship","fromEntityId","id"],
    incoming:["entityRelationship","toEntityId","id"]
  },
  situationEntity: { entity:["entity","id","entityId"] },
  actionEvidence: { citation:["citation","id","citationId"] },
  actionDependency: {
    action:["action","id","actionId"], dependsOn:["action","id","dependsOnActionId"]
  },
  citation: {
    actionEvidence:["actionEvidence","citationId","id"],
    entityRelationships:["entityRelationship","sourceCitationId","id"]
  },
  situationReplay: { situation:["situation","id","situationId"] },
  consent: { situation:["situation","id","situationId"], user:["user","id","userId"] },
  notification: { situation:["situation","id","situationId"], user:["user","id","userId"] },
  job: { situation:["situation","id","situationId"] }
};

function clone(v:any):any {
  if (v === undefined || v === null) return v;
  if (v instanceof Date) return new Date(v);
  if (Array.isArray(v)) return v.map(clone);
  if (typeof v === "object") { const o:any={}; for(const k of Object.keys(v)) o[k]=clone(v[k]); return o; }
  return v;
}
function matches(row:Row, where:any):boolean {
  if (!where) return true;
  for (const [k,v] of Object.entries(where)) {
    if (k === "AND" && !(v as any[]).every(x=>matches(row,x))) return false;
    if (k === "OR" && !(v as any[]).some(x=>matches(row,x))) return false;
    if (k === "NOT" && matches(row,v)) return false;
    if (["AND","OR","NOT"].includes(k)) continue;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      if ("equals" in v && row[k] !== (v as any).equals) return false;
      else if ("in" in v && !(v as any).in.includes(row[k])) return false;
      else if ("contains" in v && !String(row[k] ?? "").includes(String((v as any).contains))) return false;
      else if (!("equals" in v || "in" in v || "contains" in v)) { if (JSON.stringify(row[k])!==JSON.stringify(v)) return false; }
    } else if (row[k] !== v) return false;
  }
  return true;
}
function select(row:Row, spec:any):Row {
  if (!spec) return clone(row);
  const out:any={};
  for(const [k,v] of Object.entries(spec)) if(v && row[k] !== undefined) out[k]=clone(row[k]);
  return out;
}
function expand(model:string,row:Row,include:any):Row {
  const out=clone(row);
  if(!include) return out;
  for(const [name,spec] of Object.entries(include)) {
    const rel=relations[model]?.[name];
    if(!rel) continue;
    const [rm,fk,pk]=rel;
    const base=state[rm].filter(x=>x[fk]===row[pk]);
    if(Array.isArray(base)) {
      let vals=base;
      const s:any=spec;
      if(s?.where) vals=vals.filter(x=>matches(x,s.where));
      if(s?.orderBy) vals=order(vals,s.orderBy);
      if(typeof s?.take==="number") vals=vals.slice(0,s.take);
      out[name]=vals.map(x=>project(rm,x,s));
    }
  }
  return out;
}
function project(model:string,row:Row,spec:any):Row {
  let out=expand(model,row,spec?.include);
  if(spec?.select) out=select(out,spec.select);
  return out;
}
function order(rows:Row[], by:any):Row[] {
  const entries=Object.entries(by||{});
  if(!entries.length) return rows;
  const [k,d]=entries[0] as [string,any];
  return [...rows].sort((a,b)=>{
    const av=a[k] instanceof Date?a[k].getTime():a[k], bv=b[k] instanceof Date?b[k].getTime():b[k];
    if(av===bv)return 0;
    const n=av>bv?1:-1; return d==="desc"?-n:n;
  });
}
function normalize(data:any):any {
  if(data===undefined) return undefined;
  if(data===null) return null;
  if(data instanceof Date) return data;
  if(Array.isArray(data)) return data.map(normalize);
  if(typeof data!=="object") return data;
  if("create" in data && Array.isArray(data.create)) return data.create.map(normalize);
  if("create" in data && typeof data.create==="object") return normalize(data.create);
  const out:any={};
  for(const [k,v] of Object.entries(data)) if(!["connect","connectOrCreate","upsert","delete","update","set"].includes(k)) out[k]=normalize(v);
  return out;
}
function make(model:string) {
  return {
    async findMany(args:any={}) {
      let rows=state[model].filter(r=>matches(r,args.where));
      if(args.orderBy) rows=order(rows,args.orderBy);
      if(typeof args.skip==="number") rows=rows.slice(args.skip);
      if(typeof args.take==="number") rows=rows.slice(0,args.take);
      return rows.map(r=>project(model,r,args));
    },
    async findFirst(args:any={}) {
      let rows=state[model].filter(r=>matches(r,args.where));
      if(args.orderBy) rows=order(rows,args.orderBy);
      return rows[0]?project(model,rows[0],args):null;
    },
    async findUnique(args:any={}) {
      const w=args.where||{};
      let row:Row|undefined;
      const keys=Object.keys(w);
      if(keys.length===1 && typeof w[keys[0]]!=="object") row=state[model].find(r=>r[keys[0]]===w[keys[0]]);
      else row=state[model].find(r=>matches(r,Object.values(w)[0] && typeof Object.values(w)[0]==="object" ? Object.values(w)[0] : w));
      return row?project(model,row,args):null;
    },
    async count(args:any={}) { return state[model].filter(r=>matches(r,args.where)).length; },
    async create(args:any) {
      const data=normalize(args.data||{});
      const row:any={...data};
      if(!row.id) row.id=id();
      if(!row.createdAt) row.createdAt=now();
      if(model==="situation" && row.status===undefined) row.status="ACTIVE";
      if(model==="situation" && row.progress===undefined) row.progress=0;
      if(model==="action" && row.status===undefined) row.status="PROPOSED";
      if(model==="missingItem" && row.resolved===undefined) row.resolved=false;
      if(model==="notification" && row.status===undefined) row.status="PENDING";
      if(model==="job" && row.status===undefined) row.status="QUEUED";
      state[model].push(row);
      if(args.data?.steps?.create) for(const s of args.data.steps.create) {
        await make("playbookStep").create({data:{...s,playbookId:row.id}});
      }
      return project(model,row,args);
    },
    async update(args:any) {
      const w=args.where||{};
      const idx=state[model].findIndex(r=>matches(r,Object.values(w)[0] && typeof Object.values(w)[0]==="object" ? Object.values(w)[0] : w));
      if(idx<0) throw new Error("NOT_FOUND");
      const data=normalize(args.data||{});
      state[model][idx]={...state[model][idx],...data,updatedAt:now()};
      return project(model,state[model][idx],args);
    },
    async upsert(args:any) {
      const where=args.where||{};
      const key=Object.values(where)[0];
      const w=key && typeof key==="object"?key:where;
      const idx=state[model].findIndex(r=>matches(r,w));
      if(idx>=0) return this.update({where:w,data:args.update,select:args.select,include:args.include});
      return this.create({data:args.create,select:args.select,include:args.include});
    },
    async delete(args:any) {
      const w=args.where||{};
      const idx=state[model].findIndex(r=>matches(r,Object.values(w)[0] && typeof Object.values(w)[0]==="object" ? Object.values(w)[0] : w));
      if(idx<0) throw new Error("NOT_FOUND");
      const row=state[model][idx];
      state[model].splice(idx,1);
      if(model==="situation") {
        for(const [m,fk] of [["situationMember","situationId"],["document","situationId"],["event","situationId"],["action","situationId"],["insight","situationId"],["missingItem","situationId"],["situationEntity","situationId"],["notification","situationId"],["job","situationId"],["situationReplay","situationId"],["consent","situationId"]]) state[m]=state[m].filter(x=>x[fk]!==row.id);
      }
      return project(model,row,args);
    },
    async deleteMany(args:any={}) {
      const before=state[model].length; state[model]=state[model].filter(r=>!matches(r,args.where)); return {count:before-state[model].length};
    }
  };
}

export const prisma:any = new Proxy({}, { get: (_t,model:string) => make(model) });
export function resetStore(){ for(const m of models) state[m]=[]; }
export function storeInfo(){ return Object.fromEntries(models.map(m=>[m,state[m].length])); }
