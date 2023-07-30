import "./App.css";
import epubFile from "./pg11.epub";
import EPubViewer from "./EpubViewer";

function App() {
  return (
    <div className="App">
      <header>Epub.js 설치 테스트...!</header>
      <EPubViewer url={epubFile} className="EpubViewer" />
    </div>
  );
}

export default App;
