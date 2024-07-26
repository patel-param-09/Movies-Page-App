import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./App.css";
import Heading from "./components/heading";
import Herosection from "./components/Herosection";
import "bootstrap/dist/css/bootstrap.css";
import Search from "./components/search";
import debouce from "lodash.debounce";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

function App() {
  const [data, setData] = useState([]);
  const [cuurPage, setCurrPage] = useState(1);
  const [cardPerPage, setCardPerPage] = useState(5);
  const lastIndex = cuurPage * cardPerPage;
  const firstIndex = lastIndex - cardPerPage;
  const totalCards = data.slice(firstIndex, lastIndex);
  const noOfPages = Math.ceil(data.length / cardPerPage);
  const pageNumbers = [...Array(noOfPages + 1).keys()].slice(1);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const watchLater = useSelector((state) => state.name);

  // this use effect run on the first time when you open the site because atataht time the search field was empty and also runs when the search field was changed
  useEffect(() => {
    if (searchTerm === "") {
      axios.get("http://localhost:3000/api").then((res) => setData(res.data));
    } else if (searchTerm.toLowerCase() !== "") {
      const searchMovie = data.filter((movie) => {
        return movie.movie.toLowerCase().includes(searchTerm);
      });
      setData(searchMovie);
    }
    return () => {
      debouncedResults.cancel();
    };
  }, [searchTerm]);

  // main by which card rendered
  const allData = totalCards.map((ele) => {
    const iswatchLater = watchLater.some((movie) => movie.id === ele.id);
    // console.log(watchLaterId, ele.id);

    return (
      <Herosection
        title={ele.movie}
        src={ele.image}
        rating={ele.rating}
        url={ele.imdb_url}
        name={ele.movie}
        data={ele}
        key={ele.id}
        id={ele.id}
        isWatchLater={iswatchLater}
      />
    );
  });

  // Search logic
  function handleChange(e) {
    setCurrPage(1);
    setSearchTerm(e.target.value);
  }

  const debouncedResults = useMemo(() => {
    return debouce(handleChange, 300);
  }, []);

  function handleCurrPage(id) {
    if (id > noOfPages) {
      setCurrPage(1);
    }
    setCurrPage(id);
  }
  // changepage logic
  const allPageNo = pageNumbers.map((num, i) => {
    return (
      <li key={i} className={`page-item ${cuurPage === num ? "active" : ""}`}>
        <Link
          to={`/?page=${num > noOfPages ? "" : num}`}
          className="page-link"
          onClick={() => handleCurrPage(num)}
        >
          {num}
        </Link>
      </li>
    );
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrPage(page);
  }, [location.search]);

  // carde per page logic
  const perPageCard = [5, 10, 15];

  const allCards = perPageCard.map((card, i) => {
    return <option key={i}>{card}</option>;
  });

  return (
    <div className="main-div">
      <ToastContainer />
      <div>
        <Heading />
        <Search onChange={debouncedResults} />
        <div className="outer-div">{allData}</div>
        <div className="select-div">
          <ul className="pagination pagination-md">{allPageNo}</ul>
          <select
            onChange={(e) => {
              setCurrPage(1);
              setCardPerPage(e.target.value);
            }}
            className="pages"
          >
            {allCards}
          </select>
        </div>
      </div>
    </div>
  );
}

export default App;
