import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ()=>{
    // const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "" })
    const [friend, setFriend] = useState([])
    // const callmexx = (id)=> {
    //   navigate(`/profile/${id}`, { state: id });
    // }
    // const user = location.state;
    useEffect(() => {
      const res = JSON.parse(localStorage.getItem('user'));
      setUser(res)
      const fetchFriends = async () => {
        try {
          const response = await fetch('http://localhost:8080/friend/'+res.ID); // Replace with your API URL
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data)
          setFriend(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      fetchFriends()
    }, []);
    const handleMakeFriend = () => {
      navigate('/profile/makeFriend');
    };
    return (
        <div>
          <div>
            <button onClick={handleMakeFriend} className="homepage-button">MakeFriend</button>
            <h1>Details Page</h1>
            {user ? (
              <div>
                <p>Name: {user.first_name}</p>
                <p>Email: {user.email}</p>
              </div>
            ) : (
              <p>No user data available</p>
            )}
          </div>

          <div>
          <h1>Friend Details Page</h1>
      <ul>
        {friend.map((friend) => (
          <li key={friend.email}>
            <p className='friends-link' onClick={()=>{
              navigate(`/profile/${friend.ID}`, { state: [friend.ID, user.ID] });
            }}>{friend.first_name} ({friend.email})</p>
          </li>
        ))}
      </ul>
          </div>
        </div>
      );
}

export default Profile;