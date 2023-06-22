import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { userActions } from "_store";
import Pagination from "react-bootstrap/Pagination";
// import Moment from 'moment';
import { format } from 'date-fns';
export { Audit };

function Audit() {
  const users = useSelector((x) => {
    //console.log(x.users.list);
    return x.users.list;
  });
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //code for sorting begins
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortLogic, setSortLogic] = useState("");

  //for date format selection
  const [dateExtracted,setExtractedDate]=useState([]);
  const [defaultFormat,setNewFormat]=useState("12");
  const [displayDate,setDisplayDate]=useState([]);

  //for search feature
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  useEffect(() => {
    if (sortLogic) {
      const sortedRows = [...users?.value].sort((a, b) => {
        if (sortDirection === "asc") {
          return a[sortLogic] > b[sortLogic] ? 1 : -1;
        } else if (sortDirection === "asc") {
          return a[sortLogic] < b[sortLogic] ? 1 : -1;
        }
        return 0;
      });
      setRows(sortedRows);
    } else {
      setRows(users?.value || []);
    }
    // setRows(users?.value);
  }, [users, sortDirection, sortLogic, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    //for resetting the sorting
    setSortedColumn(null);
    setSortDirection(null);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    rows ? rows.length : startIndex + itemsPerPage
  );
  //adding filteredRows for search feature
  const filteredRows = rows.filter((user) => {
    const fullName = `${user.firstName} ${user.firstName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getDate = rows.filter((user) => {
    const extractedDate = `${user.createdDate}`;
    return extractedDate;
  });

  //const currentItems = rows?.slice(startIndex, endIndex);
  //change above line for search query
  const currentItems = filteredRows?.slice(startIndex, endIndex);

  const pageCount = Math.ceil(rows?.length / itemsPerPage);

  const visiblePageNumbers = Array.from(
    { length: pageCount },
    (_, index) => index + 1
  ).filter(
    (pageNumber) =>
      pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2
  );

  const handleSort = (columnName) => {
    if (sortedColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(columnName);
      setSortLogic(columnName);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    // console.log(dateExtracted);
    if(dateExtracted.length!=0){
      formatDate(dateExtracted,defaultFormat);
    }
    
  }, [dateExtracted,defaultFormat]);
  

  const selectDateFormat = (dateFormat) => {
    setExtractedDate(getDate);
    setNewFormat(dateFormat);
  }

  const formatDate = (dateExtracted,dateFormat) => {
    //handle date change formatting here
    let newDof="";
    if(dateFormat==="12"){
      newDof="MMMM do, yyyy hh:mm:ss a";
      let dateObjArr = [];


      for (let key in dateExtracted) {
        if (dateExtracted.hasOwnProperty(key)) {  
          const formattedDate = format(new Date(dateExtracted[key].createdDate),newDof);
          dateObjArr.push(formattedDate);
          // dateExtracted[key].createdDate=formattedDate;
          // console.log(displayDate);
        }
      }
      setDisplayDate(dateObjArr);

    }else{
      // const dateObj = Object.create(dateExtracted);
      let dateObjArr = [];

      newDof="MMMM do, yyyy HH:mm:ss";
      for (let key in dateExtracted) {
        if (dateExtracted.hasOwnProperty(key)) {
          const formattedDate = format(new Date(dateExtracted[key].createdDate),newDof);
          // dateObj.formattedDate=formattedDate;
          // dateExtracted[key].createdDate=formattedDate;
          dateObjArr.push(formattedDate);
          
          // dateExtracted[key].createdDate=formattedDate;
          // console.log(displayDate);
        }
      }
      setDisplayDate(dateObjArr);
    }
  }

  return (
    <div>
      <h1>Auditor Page</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name"
      />
      <br/><br/>
      <label >Select Date Format : </label>
      <select name="Change Date Format" placeholder="Change Date Format" onChange={(e)=>selectDateFormat(e.target.value)}>
        <option value="12">12hr</option>
        <option value="24">24hr</option>
      </select>

      <table className="table table-striped">
        <thead>
          <tr>
            <th
              style={{ width: "20%" }}
              onClick={() => handleSort("firstName")}
              className={
                sortedColumn === "firstName"
                  ? sortDirection === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }
            >
              First Name
              {sortedColumn === "firstName" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th
              style={{ width: "20%" }}
              onClick={() => handleSort("lastName")}
              className={
                sortedColumn === "lastName"
                  ? sortDirection === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }
            >
              Last Name
              {sortedColumn === "lastName" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th
              style={{ width: "20%" }}
              onClick={() => handleSort("username")}
              className={
                sortedColumn === "username"
                  ? sortDirection === "asc"
                    ? "asc"
                    : "desc"
                  : ""
              }
            >
              Username
              {sortedColumn === "username" && (
                <span>{sortDirection === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
            <th style={{ width: "30%" }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((user,index) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              {displayDate && displayDate.length > index ? (
      <td>{displayDate[index]}</td>
    ) : (
      <td>{user.createdDate}</td>
    )}
            </tr>
          ))}
          {users?.loading && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        <Pagination>
          {currentPage != 1 && (
            <Pagination.First onClick={() => handlePageChange(1)} />
          )}

          {currentPage > 3 && <Pagination.Ellipsis disabled />}

          {visiblePageNumbers.map((pageNumber) => (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          ))}

          {currentPage < pageCount - 2 && <Pagination.Ellipsis disabled />}

          {currentPage !== pageCount && (
            <Pagination.Last onClick={() => handlePageChange(pageCount)} />
          )}
        </Pagination>
      </div>
    </div>
  );
}
