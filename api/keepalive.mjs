// Mantém o projeto Supabase (plano grátis) ativo: o Vercel Cron chama esta rota 1x por dia
// (ver vercel.json). Faz uma leitura mínima pela API REST do Supabase, a mesma que o site usa.
// A chave anon é pública por design (já está no config.js); a RLS impede a leitura dos dados,
// então a resposta vem vazia — o que importa é a requisição chegar ao banco.
const SUPABASE_URL = 'https://behxkrznzorwmemyhqwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlaHhrcnpuem9yd21lbXlocXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzY3OTIsImV4cCI6MjEwNTg1Mjc5Mn0.bfRmyilVpr71xjJV1wy8vxrcqno7vVDVKjNYsGiEnHI';

export default async function handler(req, res) {
  const inicio = new Date().toISOString();
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/respostas?select=id&limit=1`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    console.log('[keepalive]', inicio, 'supabase status', r.status);
    res.status(r.ok ? 200 : 502).json({ ok: r.ok, supabase_status: r.status, verificado_em: inicio });
  } catch (e) {
    console.error('[keepalive]', inicio, 'erro', String(e));
    res.status(502).json({ ok: false, erro: String(e), verificado_em: inicio });
  }
}
