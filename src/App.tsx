import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
fetch("/api/chousei") 
      .then((res) => {
        if (!res.ok) throw new Error("APIが見つかりません");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error("エラー:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>調整さんデータ取得</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
}

export default App;
