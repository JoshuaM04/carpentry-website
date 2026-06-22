import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function navigation() {
    const [navHover, setNavHover] = useState(["false", "false", "false", "false"]);
    const location = useLocation();

    const isHomePage = location.pathname === '/' || location.pathname === '/home';
    const textColor = isHomePage ? 'text-white' : 'text-black bg-slate-200';
    const divColor = isHomePage ? 'bg-white' : 'bg-black';

    return (
        <header>
            <nav className={`absolute left-[50%] translate-x-[-50%] w-full ${textColor} text-sm font-semibold uppercase p-5 z-1 max-2md:text-white max-2md:bg-black max-2md:p-10`}>
                <div className="desktop-layout flex justify-center items-center gap-40 max-2md:hidden max-2md:aria-hidden">
                    <div className="flex gap-20">
                        <div>
                            <Link to="/home" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["true", "false", "false", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                                <span>home</span>
                                <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[0] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                            </Link>
                        </div>

                        <div>
                            <a onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "true", "false", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative" href="">
                                <span>gallery</span>
                                <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[1] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col items-center text-xl font-bold border-t-4 border-b-4 pt-2 pb-2 pl-6 pr-6">
                        <p>WoodWork </p>
                        <p>Creations</p>
                    </div>

                    <div className="flex gap-20">
                        <div>
                            <Link to="/contact" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "true", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                                <span>contact</span>
                                <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[2] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                            </Link>
                        </div>

                        <div>
                            <Link to="/about" onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "true"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative">
                                <span>about</span>
                                <div className={`absolute bottom-0 left-0 ${divColor} w-0 h-0.5 ${navHover[3] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mobile-layout bg-black flex justify-between items-center gap-10 2md:hidden 2md:aria-hidden">
                    <div className="flex flex-col items-center text-xl font-bold border-t-4 border-b-4 pt-2 pb-2 pl-6 pr-6">
                        <p>WoodWork </p>
                        <p>Creations</p>
                    </div>

                    <button>
                        <svg className="w-10 stroke-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7L4 7" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 12L4 12" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20 17L4 17" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                    </button>
                </div>  
            </nav>    
        </header>
    );
}