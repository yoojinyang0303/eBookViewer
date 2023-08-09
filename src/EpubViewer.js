import React, { useState, useEffect } from "react";
import Epub from "epubjs";
import Dexie from "dexie";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");

  useEffect(() => {
    let isMounted = true;

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
            console.log("[ !드래그! - cfiRange ]");
            console.log(cfiRange);
            console.log(typeof cfiRange);
            const range = newRendition.getRange(cfiRange);
            console.log("[ !드래그! - range ]");
            console.log(range);
            console.log(typeof range);
            // 'div'로 적용하는 경우도 있던데, 그렇게되면 드래그한 텍스트+block요소인 div로 텍스트 파일의 의도치않은 줄바꿈 현상 등이 나타나는 에러 발생
            // 'div'가 아닌, inline-level 요소인 span 태그를 사용하여 사용자가 딱 드래그한 만큼만 변경값 적용하기.
            const highlight = document.createElement("span");
            console.log("[ !드래그! - highlight ]");
            console.log(highlight);
            console.log(typeof highlight);
            highlight.style.backgroundColor = "rgba(253,251,165,0.5)";
            highlight.style.color = "black";
            highlight.style.position = "float";
            console.log("[ highlight ]");
            console.log(highlight);
            console.log(typeof highlight);
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
      isMounted = false;
    };
  }, [url]);

  // 페이지 로드 시 indexedDB에서 저장된 하이라이트 정보를 가져와 텍스트에 하이라이트 표식을 적용하는 작업
  useEffect(() => {
    if (rendition) {
      const db = new Dexie("highlightsDB");
      db.version(1).stores({
        highlights: "++id, cfiRange, text",
      });

      const applyHighlightsOnLoad = async () => {
        const highlights = await db.highlights.toArray();

        /*
        console.log(">> highlights");
        console.log(highlights);
        console.log("highlights[0].cfiRange");
        console.log(highlights[0].cfiRange);
        console.log(typeof highlights[0].cfiRange);
        */

        /*
        // 내가 원하는건 Epub.CFI 아니고 'Range' 객체...
        console.log("----------------------------------");
        console.log("CFI 문자열을 CFI 모듈 사용하여 Range 객체로 변환하기");
        const tmp2 = new Epub.CFI(highlights[0].cfiRange);
        console.log(tmp2);
        console.log(typeof tmp2);
        console.log("----------------------------------");
        */

        const newRendition = rendition;
        const tmpRange = newRendition.getRange(highlights[0].cfiRange);
        console.log("=-------------------------------------=");
        console.log(">> tmpRange");
        console.log(tmpRange); // -> undefined _ 왜....ㅠㅠ?
        console.log(typeof tmpRange);
        // undefined 원인
        // (1) EPUB 문서 구조의 노드 계층 구조와 정확히 일치하지 않을 가능성
        // (2) 존재하지 않는 노드를 가리키고 있을 가능성
        console.log("=-------------------------------------=");

        highlights.forEach((highlight) => {
          // range를 cfi문자열로 받으면 안 된다. Range 객체여야함.
          console.log(">> highlight");
          console.log(highlight);
          const cfiRange = highlight.cfiRange;
          console.log("cfiRange");
          console.log(cfiRange);
          //const range = cfiRange.toRange(newRendition);
          // const range = newRendition.getRange(highlight.cfiRange);
          //console.log("[[[[[ range ]]]]]");
          //console.log(range); // range 못 읽음
          //console.log(typeof range);
          /*
          const highlightElement = document.createElement("span");
          highlightElement.style.backgroundColor = "rgba(253,251,165,0.5)";
          highlightElement.style.color = "black";
          highlightElement.style.position = "float";
          // range.surroundContents는 'Range' 객체를 사용하여 DOM 요소를 감싸는 메서드.
          // range.surroundContents에 문자열 형태의 CFI를 가져오면 not a function 에러 발생 -> Range 객체가 필요한 이유
          range.surroundContents(highlightElement);
          */
        });

        if (newRendition) {
          newRendition.display();
        }
      };

      applyHighlightsOnLoad();
    }
  }, [rendition]);

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
          Page: {currentPage}
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
