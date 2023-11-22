import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';
import LoginForm from './LoginForm';

function BooksComponent() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  // function to call API to get all books in DB
  function displayAllBooks() {
    axios.get('https://booklibrarybackend.wl.r.appspot.com/findAllBooks')
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }

  function findBooksByAuthor() {
    axios.get(`https://booklibrarybackend.wl.r.appspot.com/findByAuthor?author=${searchAuthor}`)
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }

  function findBooksByUserId() {
    axios.get(`https://booklibrarybackend.wl.r.appspot.com/findByUserId?userId=${user?.uid}`)
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const postData = {
      title,
      author,
      year: parseInt(year, 10),
      userId: user?.uid
    };

    try {
      const response = await axios.post('https://booklibrarybackend.wl.r.appspot.com/saveBook', postData);
      console.log('Response:', response.data);
      displayAllBooks();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  function HandleLogin(loggedUser) {
    setUser(loggedUser);
  }

  useEffect(() => {
    if (user) {
      displayAllBooks();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <LoginForm LoginEvent={HandleLogin} />
      {user ? (
        <div className="book-list">
          {/* Search Book By Author */}
          <div className="search-form">
            <form onSubmit={(e) => {
              e.preventDefault();
              findBooksByAuthor();
            }}>
              <label>
                Search Book By Author:
                <input type="text" value={searchAuthor} onChange={e => setSearchAuthor(e.target.value)} />
              </label>
              <button type="submit">Search</button>
            </form>
          </div>

          {/* List of Books */}
          {books.map((book, index) => (
            <div className="book-item" key={index}>
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </div>
          ))}

          {/* Add New Book */}
          <form onSubmit={handleSubmit}>
            <label>
              Title:
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <br />
            <label>
              Author:
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} />
            </label>
            <br />
            <label>
              Year:
              <input type="number" value={year} onChange={e => setYear(e.target.value)} />
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      ) : (
        <p>Please log in to view and add books.</p>
      )}
    </div>
  );
}

export default BooksComponent;
