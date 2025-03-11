import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Lobby() {
  const [codeblocks, setCodeblocks] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/codeblocks`)
      .then(res => res.json())
      .then(data => setCodeblocks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="text-center">
      <h1 className="mb-4">Tom's watch</h1>
      <h2>Hi kids! </h2>
      <h3>I hope you are doing well. Although I moved away, I still want to see your progress!</h3>
      <h3>Here are some code exercises I want you to solve.</h3>
      <h1 className="mb-4">Choose code block</h1>
      
      <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
        {codeblocks.map((cb) => (
          <div key={cb.id} className="col">
            <div className="card p-5">
              <Link to={`/codeblock/${cb.id}`} className="text-decoration-none text-dark fw-bold">
                {cb.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
