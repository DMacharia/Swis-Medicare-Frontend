import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, db } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {

  const [MobileMenu, setMobileMenu] = useState(false)
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      // alert("An error occured while fetching user data");
    }
  };
  
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
		fetch("https://swis-medicare-eblx.onrender.com/api/v1/patients")
			.then((response) => response.json())
			.then((data) => setPatients(data));
	});

  useEffect(() => {
		fetch("https://swis-medicare-eblx.onrender.com/api/v1/doctors")
			.then((response) => response.json())
			.then((data) => setDoctors(data));
	});


  return (
    <>
      <header className='header'>
        <div className='container d_flex'>
          <div className='catgrories d_flex'>
            <span class='fa-solid fa-border-all'></span>
            <h4>
              Categories 
            </h4>
          </div>

          <div className='navlink'>
            <ul className={MobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"} onClick={() => setMobileMenu(false)}>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/pages'>About Us</Link>
              </li>
              <li>
                {!user ? <Link to='/login'>Login</Link> : (
                  user?.email === "peterparker@gmail.com" ? <Link to='/adminhome' style={{color: '#0f3460', fontWeight: 'bold', fontSize: '22px'}}>Admin Page</Link> : (user?.email === "bob@example.com" ? <Link style={{color: '#0f3460', fontWeight: 'bold', fontSize: '22px'}}>Patient</Link> : (user?.email === "john@example.com" ? <Link style={{color: '#0f3460', fontWeight: 'bold', fontSize: '22px'}}>Doctor</Link> : null))
                )}
              </li>
              <li>
                {user ? <Link to='/dashboard'>Logout</Link> : null}
              </li>
              <li>
                <Link to='/contact'>Contacts</Link>
              </li>
            </ul>

            <button className='toggle' onClick={() => setMobileMenu(!MobileMenu)}>
              {MobileMenu ? <i className='fas fa-times close home-btn'></i> : <i className='fas fa-bars open'></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar


//  color: '#0f3460',
// fontWeight: 'bold',
// fontSize: '22px'