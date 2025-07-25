// src/App.tsx
import { useState } from 'react';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gpt-style', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputText: input })
      });
      const data = await res.json();
      setOutput(data.result || '未识别到风格');
    } catch (err) {
      setOutput('请求失败，请检查网络或稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">豆包文本助手</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="请输入待分析文本..."
        className="w-full max-w-xl h-40 p-3 border rounded resize-none mb-4 shadow-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? '提取中...' : '提取文风'}
      </button>
      {output && (
        <pre className="mt-6 bg-white p-4 border rounded w-full max-w-xl whitespace-pre-wrap text-sm">
          {output}
        </pre>
      )}
    </div>
  );
}
