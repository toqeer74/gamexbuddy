import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { sb } from "@/lib/supabase";
import { addXp } from "@/lib/xp";

type Choice = { id: string; body: string; is_correct: boolean };
type Question = { id: string; body: string; ordinal: number; choices: Choice[] };
type Quiz = { id: string; slug: string; title: string };

export default function QuizPlay(){
  const { slug = "" } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [q, setQ] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await sb.auth.getUser();
      setMe(auth.user?.id || null);
      const { data: quizRow } = await sb.from('quizzes').select('id, slug, title').eq('slug', slug).maybeSingle();
      if (!quizRow) return;
      setQuiz(quizRow as any);
      const { data: qs } = await sb.from('quiz_questions').select('id, body, ordinal').eq('quiz_id', (quizRow as any).id).order('ordinal', { ascending: true } as any);
      const questions = (qs as any[] || []) as Question[];
      for (const qq of questions) {
        const { data: cs } = await sb.from('quiz_choices').select('id, body, is_correct').eq('question_id', qq.id);
        (qq as any).choices = (cs || []) as any;
      }
      setQ(questions);
    })();
  }, [slug]);

  const cur = q[i];
  async function pick(c: Choice){
    if (!cur) return;
    if (c.is_correct) setScore(s => s + 10);
    if (i + 1 < q.length) setI(i + 1);
    else {
      setDone(true);
      if (me) {
        try { await sb.from('quiz_attempts').insert({ quiz_id: quiz?.id, user_id: me, score }); } catch {}
        try { await addXp(score); } catch {}
      }
    }
  }

  return (
    <div className="wrap" style={{ padding: 20 }}>
      <Helmet>
        <title>{quiz?.title || 'Quiz'} | GameXBuddy</title>
        <link rel="canonical" href={canonical(`/quiz/${slug}`)} />
      </Helmet>
      <h1 className="h2">{quiz?.title || 'Quiz'}</h1>
      {done ? (
        <div className="card-glass" style={{ padding: 16 }}>Finished! Score: {score} XP</div>
      ) : cur ? (
        <div className="card-glass" style={{ padding: 16 }}>
          <div style={{ fontWeight: 800 }}>{cur.body}</div>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {cur.choices.map((c) => (
              <button key={c.id} className="gx-btn gx-btn--soft" onClick={() => pick(c)}>{c.body}</button>
            ))}
          </div>
          <div style={{ marginTop: 8, opacity: .8, fontSize: 12 }}>Question {i + 1} of {q.length}</div>
        </div>
      ) : (
        <div>Loading…</div>
      )}
    </div>
  );
}

