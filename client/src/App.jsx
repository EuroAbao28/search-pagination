import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalpages] = useState(null);

  const getLists = async () => {
    try {
      const data = await axios.get(
        `http://localhost:3000/api/users?page=${currentPage}`
      );

      if (!data.data.users) return console.log("Empty list");

      setList(data.data.users);
      setTotalpages(data.data.totalPages);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLists();
  }, [currentPage]);

  useEffect(() => {
    getLists();
  }, []);

  const changePage = (boolean) => {
    if (boolean) {
      if (currentPage === totalPages) {
        console.log("nasa last page kana");
      } else {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage === 1) {
        console.log("nasa first page kana");
      } else {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleSearch = async () => {
    if (search.length > 2) {
      try {
        const result = await axios.get(
          `http://localhost:3000/api/search?searchInput=${search}`
        );

        setSearchResults(result.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    console.log(searchResults);
  }, [searchResults]);

  return (
    <>
      <div className="app-container">
        <h2>Search Pagination</h2>
        <form onChange={handleSearch}>
          <input
            type="text"
            placeholder="Search a profile or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {search.length > 2 ? (
              searchResults.length === 0 ? (
                <tr>
                  <td className="no-user" colSpan={3}>
                    No result
                  </td>
                </tr>
              ) : (
                searchResults.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.job}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              )
            ) : (
              list?.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.job}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => changePage(false)}>prev</button>
          <button>{currentPage}</button>
          <button onClick={() => changePage(true)}>next</button>
        </div>
      </div>
    </>
  );
}

export default App;
