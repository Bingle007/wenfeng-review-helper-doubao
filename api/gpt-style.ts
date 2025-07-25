// api/gpt-style.ts
export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const userInput = body.inputText || '';

    const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'user',
            content: `请提取这段文字的写作风格（例如语言风格、情感色彩、节奏、比喻等），用一句话描述：${userInput}`
          }
        ]
      })
    });

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || '未能识别风格';

    return new Response(JSON.stringify({ result }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '解析失败，请重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
