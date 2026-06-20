export default function Home() {

  return (
    <div className="home-container">
        <main className="flex flex-col gap-20 items-center">
            <section id="video-showcase">
                <video autoPlay loop muted>
                    <source src="woodWorkSample.mp4" type="video/mp4"></source>
                </video>
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