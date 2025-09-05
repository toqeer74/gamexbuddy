import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import { getSignedUrl } from "@/lib/signedImage";
import { useEarnOnRead } from "@/hooks/useEarnOnRead";

export default function GuideMDXDetail(){
  const { slug = "" } = useParams();
  const [g, setG] = useState<any>(null);
  const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
  const [mdxError, setMdxError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

  useEffect(()=>{
    let active = true;
    (async () => {
      const { data } = await sb.from("guides").select("*").eq("slug", slug).single();
      if (!active) return;
      setG(data);
      if (data?.cover_path) {
        try { setCoverUrl(await getSignedUrl("media", data.cover_path)); } catch { setCoverUrl(undefined); }
      } else { setCoverUrl(undefined); }
      // Prefer MDX from storage by mdx_path; fallback to body_mdx inline
      if (data?.mdx_path) {
        try {
          const { data: blob, error } = await sb.storage.from("guides").download(data.mdx_path);
          if (error) throw error;
          const source = await blob!.text();
          // Dynamic imports keep mdx optional at build time
          const runtime = await import("react/jsx-runtime");
          const mdx = await import("@mdx-js/mdx");
          const { MDXProvider } = await import("@mdx-js/react");
          const { default: Highlight, themes } = await import("prism-react-renderer");
          const theme: any = (themes as any).oneDark || (themes as any).nightOwl || undefined;

          const Code = ({ className, children }: { className?: string; children?: any }) => {
            const code = String(children || "").trim();
            const lang = (className || "").replace(/^language-/, "") || "tsx";
            // @ts-ignore
            return (
              <Highlight code={code} language={lang as any} theme={theme}>
                {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
                  <pre className={className} style={{ ...style, padding: 16, overflowX: "auto", borderRadius: 8 }}>
                    {tokens.map((line: any, i: number) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token: any, key: number) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            );
          };

          const components = {
            code: Code,
            pre: (props: any) => <div {...props} />,
          } as any;

          // @ts-ignore
          const mod = await (mdx as any).run(source, { ...runtime });
          const Render = mod.default as React.ComponentType<any>;
          if (!active) return;
          const Wrapped = () => (
            // @ts-ignore
            <MDXProvider components={components}>
              <Render />
            </MDXProvider>
          );
          setMDXContent(() => Wrapped);
        } catch (e:any) {
          if (!active) return;
          setMdxError(e?.message || "Failed to parse MDX. Install @mdx-js/mdx and @mdx-js/react.");
        }
      } else if (data?.body_mdx) {
        try {
          const runtime = await import("react/jsx-runtime");
          const mdx = await import("@mdx-js/mdx");
          const { MDXProvider } = await import("@mdx-js/react");
          const { default: Highlight, themes } = await import("prism-react-renderer");
          const theme: any = (themes as any).oneDark || (themes as any).nightOwl || undefined;

          const Code = ({ className, children }: { className?: string; children?: any }) => {
            const code = String(children || "").trim();
            const lang = (className || "").replace(/^language-/, "") || "tsx";
            // @ts-ignore
            return (
              <Highlight code={code} language={lang as any} theme={theme}>
                {({ className, style, tokens, getLineProps, getTokenProps }: any) => (
                  <pre className={className} style={{ ...style, padding: 16, overflowX: "auto", borderRadius: 8 }}>
                    {tokens.map((line: any, i: number) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token: any, key: number) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            );
          };

          const components = { code: Code, pre: (props: any) => <div {...props} /> } as any;
          // @ts-ignore
          const mod = await (mdx as any).run(data.body_mdx, { ...runtime });
          const Render = mod.default as React.ComponentType<any>;
          if (!active) return;
          const Wrapped = () => (
            // @ts-ignore
            <MDXProvider components={components}>
              <Render />
            </MDXProvider>
          );
          setMDXContent(() => Wrapped);
        } catch (e:any) {
          if (!active) return;
          setMdxError(e?.message || "Failed to parse inline MDX.");
        }
      }
    })();
    return () => { active = false; };
  },[slug]);

  // Award once per guide read (slug as event_ref)
  useEarnOnRead(slug || "", { dwellMs: 40_000, scrollPct: 0.7, points: 10 });

  if (!g) return <div className="wrap">Loading…</div>;
  return (
    <div className="wrap" style={{ padding:"32px 20px" }}>
      <Helmet>
        <title>{g.title} | Guides | GameXBuddy</title>
        <link rel="canonical" href={canonical(`/guides/${slug}`)} />
        <meta name="description" content={g?.description || ""} />
      </Helmet>
      <h1 className="title-xl">{g.title}</h1>
      {coverUrl && (
        <img src={coverUrl} alt="" style={{ width:"100%", maxHeight:420, objectFit:"cover", borderRadius:12, margin:"12px 0" }} />
      )}
      {mdxError && <p style={{ color:"#c00" }}>{mdxError}</p>}
      {MDXContent ? <MDXContent /> : (!mdxError ? <p>Parsing…</p> : null)}
    </div>
  );
}
