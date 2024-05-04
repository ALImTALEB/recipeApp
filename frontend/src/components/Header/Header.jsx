import { useEffect, useState } from "react";

import "./Header.scss";

import { Link, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import toast from "react-hot-toast";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(false);

  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = async () => {
    try {
      await newRequest.get("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      setError(err);
    }
  };

  const isActive = () => {
    window.scrollY > 5 ? setActive(true) : setActive(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", isActive);

    if (error) {
      toast.error(error?.response?.data?.message);
    }
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, [error]);

  return (
    <header className={active ? "header active" : "header"}>
      <div className="logo">
        <Link to="/">
          <img src="../images/logo.jpeg" alt="" />
        </Link>
      </div>
      <nav className="nav">
        <div className="userImg">
          <img
            className="img"
            onClick={() => setUser(!user)}
            src={currentUser?.user?.img || "../images/user.png"}
            alt=""
          />
          {user && (
            <ul className="menuu">
              {currentUser ? (
                <>
                  <li>
                    <Link className="link" to={`/me/${currentUser.user._id}`}>
                      <span>My Profile</span>
                      <img src={currentUser?.user?.img || "../images/user.png"} />
                    </Link>
                  </li>

                  <li onClick={handleLogout}>
                    <span>Logout</span>
                    <img src="/images/logout.png" />
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="link">
                    <span>Login</span>
                    <img src="/images/login.png" />
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
              {currentUser?.user && (
                <>
        <div className="options">
          <img onClick={() => setMenu(!menu)} src="../images/menu.png" alt="" />
          {menu && (
            <ul className="menu">
                  <li>
                    <Link className="link" to="/myrecipes">
                      <span>My Recipes</span>
                      <img src="/images/myrecipess.png" />
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/myreviews">
                      <span>My Reviews</span>
                      <img src="/images/revieww.png" />
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/add">
                      <span>Add recipe</span>
                      <img src="/images/add.png" />
                    </Link>
                  </li>
            </ul>
              )}
        </div>
                </>
          )}
      </nav>
    </header>
  );
};

export default Header;
