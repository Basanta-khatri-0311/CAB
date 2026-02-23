import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:5500")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  return <h1>COB Frontend</h1>;
}

export default App;
