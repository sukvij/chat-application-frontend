import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MakeFriend = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/user'); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data)
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.email}>
            <Link to={`/makeFriend/${user.ID}`}>{user.first_name} ({user.email})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MakeFriend;
