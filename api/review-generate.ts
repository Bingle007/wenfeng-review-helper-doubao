// api/review-generate.ts
export default async function handler(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { article, styleHint } = body;

    const prompt = `
请以「${styleHint || '平实细腻'}」风格点评以下文章。结构分为四段，分别为：见（描述文章中打动你的画面）、感（引发的情绪共鸣）、思（深入的思考）、行（带来的启发或行动建议）。以下是文章内容：

${article}
`;

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DOUBAO_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || '点评生成失败，请稍后重试';

    return new Response(JSON.stringify({ result: output }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: '服务端错误，请重试。' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
