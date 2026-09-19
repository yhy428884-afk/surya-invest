import { useEffect, useRef } from "react";
import markup from "./markup";
import "./styles.css";

export default function App() {
  const rootRef = useRef(null);

  useEffect(() => {
    document.body.className = "bg-slate-100 flex justify-center items-center min-h-screen p-0 sm:p-4 overscroll-none";
    rootRef.current.innerHTML = markup;

    const script = document.createElement("script");
    script.src = "/legacy.js";
    script.async = false;
    document.body.appendChild(script);

    window.dispatchEvent(new Event("surya-inves:mounted"));

    return () => {
      script.remove();
      document.body.className = "";
    };
  }, []);

  return <div ref={rootRef} />;
}
