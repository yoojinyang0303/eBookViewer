import epubFile from "./pg11.epub";
import EPubViewer from "./EpubViewer";

function App() {
  return (
    <div className="App">
      <EPubViewer url={epubFile} className="EpubViewer" />
    </div>
  );
}

export default App;
