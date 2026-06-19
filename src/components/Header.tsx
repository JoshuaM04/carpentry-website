import { useState } from 'react';

export default function Header() {
    const [navHover, setNavHover] = useState(["false", "false", "false", "false"]);

    return (
        <header>
            <nav className="absolute top-0 left-[50%] translate-x-[-50%] w-full text-white text-sm font-semibold uppercase p-2">
                <ul className="flex justify-around items-center gap-5">
                    <li>
                        <a onMouseEnter={() => { console.log(navHover[0]); setNavHover(["true", "false", "false", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative" href="">
                            <span>home</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[0] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </a>
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
                        <a onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "true", "false"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative" href="">
                            <span>contact</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[2] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </a>
                    </li> 
                    <li>
                        <a onMouseEnter={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "true"]) }} onMouseLeave={() => { console.log(navHover[0]); setNavHover(["false", "false", "false", "false"]) }} className="relative" href="">
                            <span>about</span>
                            <div className={`absolute bottom-0 left-0 bg-white w-0 h-0.5 ${navHover[3] === "true" ? 'w-full transition-all' : 'w-0'}`}></div>
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}