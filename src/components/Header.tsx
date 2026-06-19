export default function Header() {
    return (
        <header>
            <nav className="sticky top-0 text-white text-sm bg-black font-semibold uppercase border-b p-2">
                <ul className="flex justify-around items-center gap-5">
                    <li className="hover:text-stone-400"><a href="">home</a></li> 
                    <li className="hover:text-stone-400"><a href="">gallery</a></li>
                    <svg height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.455 512.455" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path className="fill-svgLeftHandle" d="M189.365,251.814l59.145-65.324L71.076,8.172c-10.593-10.593-28.248-10.593-38.841,0L8.4,32.007 C-2.193,42.6-2.193,60.255,8.4,70.848L189.365,251.814z"></path> <path className="fill-svgLeftToolTip" d="M470.083,506.931l42.372,5.297l-6.179-43.255l-38.841-26.483l-24.717,25.6L470.083,506.931z"></path> <path className="fill-svgLeftToolBar" d="M282.055,306.545L443.6,468.09l24.717-24.717L306.772,281.828L282.055,306.545z"></path> <path className="fill-svgLeftHandleTrim" d="M194.662,203.262c-2.648,0-4.414-0.883-6.179-2.648L38.414,50.545c-3.531-3.531-3.531-8.828,0-12.359 c3.531-3.531,8.828-3.531,12.359,0l150.069,150.069c3.531,3.531,3.531,8.828,0,12.359 C199.076,202.379,197.31,203.262,194.662,203.262"></path> <path className="fill-svgRightHandle" d="M282.055,147.648c20.303-20.303,22.952-52.083,1.766-73.269 c-41.49-41.49-65.324-37.076-112.11-37.076C242.331,6.407,293.531-0.655,344.731,23.179c22.069,9.71,30.897,18.538,48.552,36.193 l31.779,31.779c7.945,7.945,13.241,18.538,15.007,29.131c2.648,16.772-1.766,20.303,9.71,32.662c3.531,3.531,8.828,3.531,12.359,0 c3.531-3.531,8.828-3.531,12.359,0l30.897,30.897c7.062,7.062,7.062,17.655,0,24.717l-62.676,62.676 c-7.062,7.062-17.655,7.062-24.717,0l-29.131-30.014c-3.531-3.531-3.531-8.828,0-12.359c3.531-3.531,3.531-9.71,0-13.241 c-12.359-12.359-15.89-7.945-32.662-9.71c-11.476-1.766-21.186-7.062-29.131-15.007L282.055,147.648"></path> <path className="fill-svgRightToolBar" d="M282.055,147.648L8.4,453.966c-10.593,10.593-11.476,28.248-0.883,37.959l12.359,12.359 c10.593,10.593,27.366,9.71,37.959-0.883l274.538-307.2L282.055,147.648z"></path> <path className="fill-svgLeftToolCasing" d="M238.8,300.366l24.717,24.717l62.676-62.676l-28.248-28.248L238.8,300.366z"></path> </g></svg>
                    <li className="hover:text-stone-400"><a href="">contact</a></li> 
                    <li className="hover:text-stone-400"><a href="">about</a></li>
                </ul>
            </nav>
        </header>
    );
}