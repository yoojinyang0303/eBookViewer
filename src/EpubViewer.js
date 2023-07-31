// 하이라이트 추가 기능 도전
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

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

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

/*
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

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

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
/*

/*
// 0731 - 전체 페이지 수 계산 실패
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadEpub = async () => {
      const epub = new Epub(url);

      const spine = epub.spine;
      console.log("spine");
      console.log(spine);
      console.log("spine Type: " + typeof spine);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }

        const nav = await epub.loaded.navigation;
        let lastPage = 0;
        for (const page of nav.toc) {
          if (page.order > lastPage) {
            lastPage = page.order;
          }
        }

        if (isMounted) {
          setTotalPages(lastPage + 1);
          console.log(`전자책의 전체 페이지 수: ${lastPage + 1}`);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

        if (isMounted) {
          setRendition(newRendition);
          newRendition.display();
        }

        /*
        newRendition.on("displayed", () => {
          const totalPageCount = getTotalPages(epub);
          setTotalPages(totalPageCount);
          console.log(`전체 페이지 수: ${totalPageCount}`);
        });
        
      } catch (error) {
        console.error("Error loading EPUB:", error);
      }
    };

    loadEpub();

    return () => {
      isMounted = false;
    };
  }, [url]);

  //

  // getTotalPages 함수 정의
  const getTotalPages = (epub) => {
    const spine = epub.spine.items;
    let totalPageCount = 0;

    spine.forEach((item) => {
      const href = item.href;
      const content = epub.contents[epub.spine.hrefs.indexOf(href)];
      const pageCount = content.pages.length;
      totalPageCount += pageCount;
    });

    return totalPageCount;
  };

  // 현재 페이지가 마지막 페이지인지를 판별하는 함수
  const isLastPage = () => {
    return currentPage === totalPages - 1;
  };

  //

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
      if (isLastPage()) {
        alert("마지막 페이지입니다 :)");
        return;
      }
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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
// 마지막 페이지에서 '다음 페이지' 버튼 클릭 시 "마지막 페이지" alert 기능
// but 전체 페이지 수가 '1'로 감지되어 기능이 정상동작하지 않음
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadEpub = async () => {
      const epub = new Epub(url);

      const spine = epub.spine;
      console.log("spine");
      console.log(spine);
      console.log("spine Type: " + typeof spine);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }

        const nav = await epub.loaded.navigation;
        let lastPage = 0;
        for (const page of nav.toc) {
          if (page.order > lastPage) {
            lastPage = page.order;
          }
        }

        if (isMounted) {
          setTotalPages(lastPage + 1);
          console.log(`전자책의 전체 페이지 수: ${lastPage + 1}`);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

        if (isMounted) {
          setRendition(newRendition);
          newRendition.display();
        }

        /*
        newRendition.on("displayed", () => {
          const totalPageCount = getTotalPages(epub);
          setTotalPages(totalPageCount);
          console.log(`전체 페이지 수: ${totalPageCount}`);
        });
        
      } catch (error) {
        console.error("Error loading EPUB:", error);
      }
    };

    loadEpub();

    return () => {
      isMounted = false;
    };
  }, [url]);

  //

  // getTotalPages 함수 정의
  const getTotalPages = (epub) => {
    const spine = epub.spine.items;
    let totalPageCount = 0;

    spine.forEach((item) => {
      const href = item.href;
      const content = epub.contents[epub.spine.hrefs.indexOf(href)];
      const pageCount = content.pages.length;
      totalPageCount += pageCount;
    });

    return totalPageCount;
  };
  //

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
      if (currentPage === totalPages - 1) {
        alert("마지막 페이지입니다 :)");
        return;
      }
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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadEpub = async () => {
      const epub = new Epub(url);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

        if (isMounted) {
          setRendition(newRendition);
          newRendition.display();
        }

        newRendition.on("displayed", () => {
          const totalPageCount = getTotalPages(epub);
          setTotalPages(totalPageCount);
          console.log(`전자책의 전체 페이지 수: ${totalPageCount}`);
        });
      } catch (error) {
        console.error("Error loading EPUB:", error);
      }
    };

    loadEpub();

    return () => {
      isMounted = false;
    };
  }, [url]);

  // getTotalPages 함수 정의
  const getTotalPages = (epub) => {
    const spine = epub.book.loaded.spine;
    let totalPageCount = 0;

    spine.forEach((item) => {
      const href = item.href;
      const content = epub.book.contents[epub.book.spine.hrefs.indexOf(href)];
      const pageCount = content.pages.length;
      totalPageCount += pageCount;
    });

    return totalPageCount;
  };

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
      if (currentPage === totalPages - 1) {
        alert("마지막 페이지입니다 :)");
        return;
      }
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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
// 마지막 페이지에서 '다음 페이지' 버튼 클릭 시 "마지막 페이지" alert 기능
// but 전체 페이지 수가 '1'로 감지되어 기능이 정상동작하지 않음
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadEpub = async () => {
      const epub = new Epub(url);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }

        const nav = await epub.loaded.navigation;
        let lastPage = 0;
        for (const page of nav.toc) {
          if (page.order > lastPage) {
            lastPage = page.order;
          }
        }

        if (isMounted) {
          setTotalPages(lastPage + 1);
          console.log(`전자책의 전체 페이지 수: ${lastPage + 1}`);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

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
      if (currentPage === totalPages - 1) {
        alert("마지막 페이지입니다 :)");
        return;
      }
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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
// 전체 페이지 수 정확하게 계산 안 되는 코드
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트된 상태인지 체크하는 변수

    const loadEpub = async () => {
      const epub = new Epub(url);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }
        console.log(metadata);

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

        if (isMounted) {
          setRendition(newRendition);
          newRendition.display();

          // const totalPageCount = newRendition.book.locations.total;
          console.log("newRendition.book");
          console.log(newRendition.book);
          const nav = await epub.loaded.navigation;
          const totalPageCount = nav.toc.length;
          console.log("totalPageCount");
          console.log(totalPageCount);
          setTotalPages(totalPageCount);
          console.log(`전자책의 전체 페이지 수: ${totalPageCount}`);
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
      if (currentPage === totalPages - 1) {
        alert("마지막 페이지입니다 :)");
        return;
      }
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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
import React, { useState, useEffect } from "react";
import Epub from "epubjs";

const EPubViewer = ({ url }) => {
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let isMounted = true; // 컴포넌트가 마운트된 상태인지 체크하는 변수

    const loadEpub = async () => {
      const epub = new Epub(url);

      try {
        const metadata = await epub.loaded.metadata;
        if (isMounted) {
          setBookTitle(metadata.title);
          console.log(`책 제목: ${metadata.title}`);
        }

        const nav = await epub.loaded.navigation;
        let lastPage = 0;
        for (const page of nav.toc) {
          if (page.order > lastPage) {
            lastPage = page.order;
          }
        }

        if (isMounted) {
          setTotalPages(lastPage + 1); // 실제 전체 페이지 수 계산 (order 값이 0부터 시작하므로 +1 해줌)
          console.log(`전자책의 전체 페이지 수: ${lastPage + 1}`);
        }

        const newRendition = epub.renderTo("area", {
          flow: "paginated",
          width: "100%",
          height: "92vh",
        });

        newRendition.themes.register("custom", {
          h2: { color: "black !important" },
          p: { color: "black !important" },
          div: { color: "black !important" },
          a: { color: "black !important" },
        });
        newRendition.themes.select("custom");

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
          page: {currentPage + 1} / {totalPages}
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
*/

/*
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
      height: "92vh",
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
          height: "8vh",
          color: "blue",
          textWeight: "bold",
          backgroundColor: "mintcream",
        }}
      >
        <div>책 제목:</div>
        <div>현재 페이지: {currentPage}</div>
        <button onClick={prevPage}>이전 페이지</button>
        <button onClick={nextPage}>다음 페이지</button>
      </div>
      <div id="area"></div>
    </>
  );
};

export default EPubViewer;
*/
