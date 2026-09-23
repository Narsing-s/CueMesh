"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:24}}>
      <section style={{maxWidth:520,textAlign:"center"}}>
        <h1>Something went wrong</h1>
        <p style={{opacity:.7}}>CueMesh could not load this view.</p>
        <button className="primary" onClick={() => reset()}>Try again</button>
      </section>
    </main>
  );
}