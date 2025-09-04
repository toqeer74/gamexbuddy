import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import BuyPlusButton from "@/components/billing/BuyPlusButton";
import ManageBillingButton from "@/components/billing/ManageBillingButton";
import { getAvatarUrl } from "@/lib/signedImage";
import { useDebounce } from "@/lib/useDebounce";

type Profile = {
  id: string;
  bio?: string | null;
  is_premium?: boolean | null;
  stripe_status?: string | null;
  avatar_url?: string | null;
};

export default function Settings(){
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState("");
  const [nameBusy, setNameBusy] = useState(false);
  const [nameOk, setNameOk] = useState<boolean | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [suggests, setSuggests] = useState<string[]>([]);
  const debounced = useDebounce(username, 400);

  const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
  function normalizeName(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").slice(0, 20);
  }
  function makeSuggestions(base: string) {
    const b = normalizeName(base);
    const picks = [
      b,
      `${b}_gxb`,
      `${b}123`,
      `${b}${new Date().getFullYear() % 100}`,
      `${b}_${Math.floor(Math.random()*99)+1}`
    ];
    return Array.from(new Set(picks)).slice(0, 5);
  }

  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getUser();
      const u = data.user;
      if (!u) return;
      setUser({ id: u.id, email: (u as any)?.email });
      const { data: prof } = await sb.from("profiles").select("id, bio, is_premium, stripe_status, avatar_url").eq("id", u.id).single();
      if (prof) {
        setProfile(prof as Profile);
        setBio((prof as any).bio || "");
        setUsername(((prof as any).username || "") as string);
        if ((prof as any).avatar_url) {
          const url = await getAvatarUrl((prof as any).avatar_url);
          setAvatarSignedUrl(url);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!debounced) { setNameOk(null); setNameError(null); setSuggests([]); return; }
      if (!USERNAME_RE.test(debounced)) {
        setNameOk(false);
        setNameError("Use 3–20 chars: a–z, 0–9, underscore (_).");
        setSuggests(makeSuggestions(debounced));
        return;
      }
      if (debounced.toLowerCase() === (profile?.username || "").toLowerCase()) { setNameOk(null); setNameError(null); setSuggests([]); return; }
      setNameBusy(true);
      const { data } = await sb.from("profiles").select("id").ilike("username", debounced).limit(1);
      setNameBusy(false);
      const available = !(data && data.length);
      setNameOk(available);
      setNameError(available ? null : "Already taken.");
      setSuggests(available ? [] : makeSuggestions(debounced));
    })();
  }, [debounced, profile?.username]);

  async function onSave(e: React.FormEvent){
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await sb.from("profiles").update({ bio }).eq("id", user.id);
    setSaving(false);
  }

  async function saveUsername(){
    if (!user?.id) return;
    if (!USERNAME_RE.test(username)) return alert("Invalid username format.");
    if (nameOk === false) return alert("That username is taken");
    const { error } = await sb.from("profiles").update({ username }).eq("id", user.id);
    if (error) return alert("Could not save username");
    alert("Username saved");
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0];
    if (!f || !user) return;
    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${f.name}`.replace(/\s+/g, "-");
      const up = await sb.storage.from("avatars").upload(path, f, { upsert: false, contentType: f.type });
      if (up.error) throw up.error;
      await sb.from("profiles").update({ avatar_url: path }).eq("id", user.id);
      setProfile((p)=> p ? { ...p, avatar_url: path } : p);
      const signed = await getAvatarUrl(path);
      setAvatarSignedUrl(signed);
    } catch (_e) {
      alert("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  }

  const isPremium = !!profile?.is_premium;

  return (
    <div className="wrap" style={{ padding: "40px 20px", display: 'grid', gap: 16 }}>
      <Helmet>
        <title>Settings | GameXBuddy</title>
        <link rel="canonical" href={canonical("/settings")} />
      </Helmet>
      <h1 className="h2">Account Settings</h1>

      <section className="card-glass" style={{ padding: 16 }}>
        <h2 className="h3" style={{ marginTop: 0 }}>Premium</h2>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span>Status: {isPremium ? "Active" : "Free"} {profile?.stripe_status ? `(${profile.stripe_status})` : ""}</span>
          {isPremium ? (
            <ManageBillingButton userId={user?.id} />
          ) : (
            <BuyPlusButton userId={user?.id} email={user?.email} />
          )}
        </div>
      </section>

      <section className="card-glass" style={{ padding: 16, display:'grid', gap:12 }}>
        <h2 className="h3" style={{ marginTop: 0 }}>Profile</h2>
        <div className="card-glass" style={{ padding: 12, display:'grid', gap:8 }}>
          <label htmlFor="username"><strong>Username</strong></label>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input id="username" value={username} onChange={e=>setUsername(normalizeName(e.target.value))} placeholder="e.g. gamer123" className="nl__input" aria-describedby="username-help" />
            <button className="gx-btn" onClick={saveUsername} disabled={nameBusy || nameOk===false}>Save</button>
          </div>
          <div id="username-help" style={{ minHeight: 20 }}>
            {nameBusy && <small>Checking…</small>}
            {nameError && <small style={{color:"#d73a49"}}>{nameError}</small>}
            {nameOk===true && debounced && <small style={{color:"#3fb950"}}>Available ✓</small>}
          </div>
          {!!suggests.length && (
            <div className="suggest-row">
              {suggests.map(s => (
                <button key={s} type="button" className="suggest-chip" onClick={()=> setUsername(s)} aria-label={`Use ${s}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {avatarSignedUrl ? (
            <img src={avatarSignedUrl} alt="Avatar" style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover' }} />
          ) : (
            <div style={{ width:64, height:64, borderRadius:'50%', background:'#222', display:'grid', placeItems:'center' }}>🙂</div>
          )}
          <label className="gx-btn gx-btn--soft">
            Change avatar
            <input type="file" accept="image/*" onChange={onAvatarChange} style={{ display:'none' }} disabled={uploading} />
          </label>
        </div>
        <form onSubmit={onSave} style={{ display:'grid', gap: 8 }}>
          <label>
            <div style={{ fontSize:12, opacity:.8, marginBottom:4 }}>Bio</div>
            <textarea value={bio} onChange={(e)=>setBio(e.target.value)} rows={3} style={{ width:'100%', padding:10, borderRadius:10 }} />
          </label>
          <div>
            <button className="gx-btn gx-btn--soft" disabled={saving}>{saving? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
