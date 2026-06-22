export default function Home() {

  return (
    <div className="home-container">
        <main className="flex flex-col gap-50 items-center">
            <section id="video-showcase" className="relative h-screen w-full overflow-hidden">
                <video className="top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
                    <source src="woodWorkSample.mp4" type="video/mp4"></source>
                </video>

                <div className="text-white top-[45%] left-[50%] translate-x-[-50%] absolute">
                    <h1 className="font-bold flex flex-col gap-4 text-6xl text-center">
                        <div>Hand Crafted</div>
                        <div>Real Materials</div>
                        <div>Family Owned</div>
                    </h1>
                </div>

                <div className="flex flex-col justify-center items-center gap-5 text-white bottom-20 left-[50%] translate-x-[-50%] absolute">
                    <p className="explore-text font-bold uppercase">Explore</p>

                    <a href="#furniture-menu" className="flex justify-center items-center explore-arrow-container bg-slate-900 rounded-full animate-bounce">
                        <svg className="fill-white w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3Z"></path> </g></svg>
                    </a>
                </div>
            </section>

            <section id="furniture-menu" className="flex flex-col gap-10 w-full p-10">
                <p className="text-2xl font-bold">Custom Tables</p>

                <div className="flex flex-wrap gap-10">
                    <div className="w-50 h-60">
                        <img src="/furniture/tables/furnitureOne.webp" alt="" />

                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Table #1</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img src="/furniture/tables/furtnitureTwo.jpg" alt="" />

                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Table #2</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img src="/furniture/tables/furnitureThree.jpg" alt="" />
                        
                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Table #3</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img src="/furniture/tables/furnitureFour.jpg" alt="" />
                        
                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Table #4</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>
                </div>

                <hr />

                <p className="text-2xl font-bold">Custom Chairs</p>

                <div className="flex flex-wrap gap-10">
                    <div className="w-50 h-60">
                        <img className="w-[199.97px] h-[96.83px]" src="/furniture/chairs/chairOne.webp" alt="" />

                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Chair #1</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img className="w-[199.97px] h-[96.83px]" src="/furniture/chairs/chairTwo.webp" alt="" />

                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Chair #2</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img className="w-[199.97px] h-[96.83px]" src="/furniture/chairs/chairThree.webp" alt="" />
                        
                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Chair #3</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>

                    <div className="w-50 h-60">
                        <img className="w-[199.97px] h-[96.83px]" src="/furniture/chairs/chairFour.webp" alt="" />
                        
                        <div className="flex flex-col gap-4 p-5">
                            <p className="font-semibold">Chair #4</p>

                            <div>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 bg-black"></div>
                                    <div className="w-4 h-4 bg-red-900"></div>
                                </div>
                                <p className="text-xs">2 color options</p>
                            </div>

                            <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                        </div>
                    </div>
                </div>

                <hr />

                <p className="text-2xl font-bold">Nightstands</p>

            </section>
        </main>
    </div>
  );
}