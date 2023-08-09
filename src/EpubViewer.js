import React, { useState, useEffect } from "react";
import Epub from "epubjs";
import Dexie from "dexie";

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
          height: "90vh",
        });

        // default - 기본 테마
        newRendition.themes.register("default", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });

        newRendition.themes.select("default");

        // highlight 적용 + IndexedDB에 하이라이트 정보 저장
        newRendition.on("selected", async (cfiRange) => {
          if (cfiRange) {
            // 드래그한 텍스트에 하이라이트 적용
            const range = newRendition.getRange(cfiRange);
            // 'div'로 적용하는 경우도 있던데, 그렇게되면 드래그한 텍스트+block요소인 div로 텍스트 파일의 의도치않은 줄바꿈 현상 등이 나타나는 에러 발생
            // 'div'가 아닌, inline-level 요소인 span 태그를 사용하여 사용자가 딱 드래그한 만큼만 변경값 적용하기.
            const highlight = document.createElement("span");
            highlight.style.backgroundColor = "rgba(253,251,165,0.5)";
            highlight.style.color = "black";
            highlight.style.position = "float";
            range.surroundContents(highlight); // Range 객체로 텍스트에 하이라이트 추가

            const text = range.toString();
            const db = new Dexie("highlightsDB");
            db.version(1).stores({
              highlights: "++id, cfiRange, text",
            });

            try {
              await db.highlights.add({ cfiRange, text });
            } catch (error) {
              console.error("Error adding highlight to IndexedDB: ", error);
            }
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
          height: "10vh",
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
          * page: {currentPage}
        </div>
      </div>
      <div id="ebookContainer" style={{ display: "flex" }}>
        <button onClick={prevPage} style={{ width: "2%" }}>
          &lt;
        </button>
        <div id="area" style={{ width: "96%", overflow: "hidden" }}></div>
        <button onClick={nextPage} style={{ width: "2%" }}>
          &gt;
        </button>
      </div>
    </>
  );
};

export default EPubViewer;
