import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function navigation() {
    const [navHover, setNavHover] = useState(["false", "false", "false", "false"]);
    const location = useLocation();

    const isHomePage = location.pathname === '/home';
    const textColor = isHomePage ? 'text-white' : 'text-black bg-slate-200';
    const divColor = isHomePage ? 'bg-white' : 'bg-black';

    return (
        <header>
            <nav className={`absolute top-0 left-[50%] translate-x-[-50%] w-full ${textColor} text-sm font-semibold uppercase p-2`}>
                <ul className="flex justify-around items-center gap-5">
                    <li>
                        <Link to="/home" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["true", "false", "false", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                            <span>home</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[0] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </Link>
                    </li> 
                    <li>
                        <a onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "true", "false", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative" href="">
                            <span>gallery</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[1] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </a>
                    </li>
                    <li className="flex flex-col items-center text-xl font-bold border-4 pt-2 pb-2 pl-6 pr-6">
                        <p>WoodWork </p>
                        <p>Creations</p>
                    </li>
                    <li>
                        <Link to="/contact" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "true", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                            <span>contact</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[2] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </Link>
                    </li> 
                    <li>
                        <Link to="/about" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "true"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                            <span>about</span>
                            <div className={`absolute bottom-0 left-0 ${divColor} w-0 h-0.5 ${navHover[3] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </Link>
                    </li>
                </ul>  
            </nav>    
        </header>
    );
}