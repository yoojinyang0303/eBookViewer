import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트된 상태인지 체크하는 변수

    const loadEpub = async () => {
      const epub = new Epub(url);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        // default - 기본 테마
        newRendition.themes.register("default", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });

        // highlighted - 텍스트 드래그 시 적용할 테마
        newRendition.themes.register("highlighted", {
          h2: { backgroundColor: "yellow !important" },
          p: { backgroundColor: "yellow !important" },
          div: { backgroundColor: "yellow !important" },
          a: { backgroundColor: "yellow !important" },
        });

        newRendition.themes.select("default");

        newRendition.on("selected", (cfiRange) => {
          if (cfiRange) {
            // 드래그한 텍스트에 하이라이트 적용
            newRendition.annotations.highlight(cfiRange, {}, (e) => {});
          }
        });

        if (isMounted) {
          setRendition(newRendition);
          newRendition.display();
        }
      } catch (error) {
        console.error("Error loading EPUB:", error);
      }
    };

    loadEpub();

    return () => {
      isMounted = false; // 컴포넌트가 언마운트되었을 때 isMounted 변수를 false로 변경하여 비동기 작업 중지
    };
  }, [url]);

  const prevPage = () => {
    if (rendition) {
      if (currentPage === 0) {
        alert("첫 페이지입니다 :)");
        return;
      }
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
        id="bookInfo"
        style={{
          height: "8vh",
          textWeight: "bold",
          textAlign: "center",
          backgroundColor: "rgba(205,205,206,0.3)",
        }}
      >
        <h1
          style={{
            margin: "0",
            paddingTop: "1.6rem",
            fontSize: "2rem",
          }}
        >
          {bookTitle}
        </h1>
        <div style={{ padding: "1vh 0 1vh 0", fontSize: "1.5rem" }}>
          page: {currentPage}
        </div>
      </div>
      <div id="ebookContainer" style={{ display: "flex" }}>
        <button onClick={prevPage} style={{ width: "2%" }}>
          &lt;
        </button>
        <div id="area" style={{ width: "96%" }}></div>
        <button onClick={nextPage} style={{ width: "2%" }}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default EPubViewer;
