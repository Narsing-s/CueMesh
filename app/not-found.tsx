export default function NotFound() {
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24}}>
      <section style={{maxWidth:520,textAlign:"center"}}>
        <h1>Page not found</h1>
        <p style={{opacity:.7}}>The CueMesh situation you requested does not exist.</p>
        <a className="primary" href="/">Back to CueMesh</a>
      </section>
    </main>
  );
}