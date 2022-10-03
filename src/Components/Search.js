
import React,{useRef} from 'react'

function Search({searchUserName,isSuccess}){
  const inputRef = useRef();
  const searched = e =>{
    e.preventDefault();
    const searchKeyword = inputRef.current.value;
    searchUserName(searchKeyword)

  }
return(
<div className='card search'>
  <h2>Search for Username</h2>
  <form onSubmit={searched}>
  <input type= 'teaxt' ref={inputRef } className = {isSuccess === false ? "incorrect-input" : ""}  ></input>
  <button>Search</button>
  </form>
  {isSuccess === false ? (
    <p className='invalid'>Invalid Username</p>
  ) : false}
</div>



);

}

export default Search;