import { Link, Navigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx";
import { CiCircleRemove } from "react-icons/ci";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
export default function Header()  {
    const [isClicked, setIsClicked] = useState(false);
    const Navigate = useNavigate();
    async function handleLogOut() {
        try {
            fetch('/logout').then(() => Navigate('/login'));
        } catch(err) {
            console.log('failed logout', err)
        }
    }
    return(
        <header>
            
            <div className="logo" width="100px">
            <img src="../2e2d.webp" alt="" />
            </div>
            <div className="links">
            <Link to="/">Home</Link>
            <Link to="/AF1">AF1</Link>
            <Link to="/ET1">ET1</Link>
            <Link to="/CL1">CL1</Link>
            <Link to="/HR1">HR1</Link>
            <Link to="/AI1">AI1</Link>
            <Link to="/DI1">DI1</Link>
            <div onClick={handleLogOut}>
                <p>Logout</p>
                <IoIosLogOut />
            </div>
            </div>
            {!isClicked && <><RxHamburgerMenu className="burger-menu" onClick={() => setIsClicked(true)} /></> } 
            {isClicked && (
            <div className="phone-links">
            <CiCircleRemove style={{
                fontSize:'33px',
                textAlign: 'left'
            }} onClick={() => setIsClicked(false)}/>
            <Link to="/">Home</Link>
            <Link to="/AF1">AF1</Link>
            <Link to="/ET1">ET1</Link>
            <Link to="/CL1">CL1</Link>
            <Link to="/HR1">HR1</Link>
            <Link to="/AI1">AI1</Link>
            <Link to="/DI1">DI1</Link>
            <div onClick={handleLogOut} style={{fontSize:'20px', cursor: "pointer", marginTop: '10px'}}>
                <p>Logout</p>
                <IoIosLogOut />
            </div>
            </div>
            )}

        </header>
    )
}