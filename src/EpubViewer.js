import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const epub = new Epub(url);

    const newRendition = epub.renderTo("area", {
      flow: "paginated",
      width: "100%",
      height: "95vh",
    });

    newRendition.themes.register("custom", {
      h2: { color: "black !important" },
      p: { color: "black !important" },
      div: { color: "black !important" },
      a: { color: "black !important" },
    });
    newRendition.themes.select("custom");

    setRendition(newRendition);
    newRendition.display();
  }, [url]);

  const prevPage = () => {
    if (rendition) {
      rendition.prev();
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const nextPage = () => {
    if (rendition) {
      rendition.next();
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <div
        id="nav"
        style={{
          height: "5vh",
          color: "blue",
          textWeight: "bold",
          backgroundColor: "mintcream",
        }}
      >
        <div>현재 페이지: {currentPage}</div>
        <button onClick={prevPage}>이전 페이지</button>
        <button onClick={nextPage}>다음 페이지</button>
      </div>
      <div id="area"></div>
    </>
  );
};

export default EPubViewer;
