import Footer from '../components/footer';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <div className="home-container flex flex-col gap-20">
            <main className="flex flex-col gap-80 items-center">
                <section id="video-showcase" className="relative h-screen w-full overflow-hidden">
                    <video 
                        className="top-0 left-0 w-full h-full object-cover pointer-events-none max-2md:hidden max-2md:aria-hidden" autoPlay loop muted>
                        <source className="max-2md:hidden max-2md:aria-hidden" src="woodWorkSample.mp4" type="video/mp4"></source>
                    </video>

                    <div className="h-screen w-full overflow-hidden mt-40 pointer-events-none"><img className="top-0 left-0 w-full h-full object-cover" src="/heroSectionImage.avif" alt="" /></div>

                    <div className="text-white top-[45%] left-[50%] translate-x-[-50%] absolute max-2md:w-56.25 max-2md:top-[50%]">
                        <h1 className="font-bold flex flex-col gap-4 text-6xl text-center">
                            <div>Hand Crafted</div>
                            <div>Real Materials</div>
                            <div>Family Owned</div>
                        </h1>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-5 text-white bottom-20 left-[50%] translate-x-[-50%] absolute max-2md:bottom-10">
                        <p className="explore-text font-bold uppercase">Explore</p>

                        <a href="#cart" className="flex justify-center items-center explore-arrow-container bg-slate-900 rounded-full animate-bounce">
                            <svg className="fill-white w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3Z"></path> </g></svg>
                        </a>
                    </div>
                </section>

                <section id="furniture-menu" className="flex flex-col gap-10 w-full p-10">
                    <p className="text-2xl font-bold max-xsm:text-center">Custom Tables</p>

                    <div className="flex flex-wrap justify-between items-center gap-10 max-xsm:justify-center">
                        <Link to="/TableOne" className="w-50 h-60">
                            <img src="/furniture/catalog/tables/furnitureOne.webp" alt="" />

                            <div className="flex flex-col gap-4 p-5">
                                <p className="font-semibold">Table #1</p>

                                <div>
                                    <div className="flex gap-2">
                                        <div className="w-4 h-4 bg-black"></div>
                                        <div className="w-4 h-4 bg-red-900"></div>
                                    </div>
                                    <p className="text-xs">2 color options</p>
                                </div>

                                <div className="ratings flex gap-2">
                                    <div className="flex">
                                        <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                        <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                        <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                        <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                        <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    </div>

                                    <p>(0)</p>
                                </div>

                                <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                            </div>
                        </Link>

                        <div className="w-50 h-60">
                            <img src="/furniture/catalog/tables/furtnitureTwo.jpg" alt="" />

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
                            <img src="/furniture/catalog/tables/furnitureThree.jpg" alt="" />
                            
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
                            <img src="/furniture/catalog/tables/furnitureFour.jpg" alt="" />
                            
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

                    <p className="text-2xl font-bold max-xsm:text-center">Custom Chairs</p>

                    <div className="flex flex-wrap justify-between items-center gap-10 max-xsm:justify-center">
                        <div className="w-50 h-60">
                            <img className="w-[199.97px] h-[96.83px]" src="/furniture/catalog/chairs/chairOne.webp" alt="" />

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
                            <img className="w-[199.97px] h-[96.83px]" src="/furniture/catalog/chairs/chairTwo.webp" alt="" />

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
                            <img className="w-[199.97px] h-[96.83px]" src="/furniture/catalog/chairs/chairThree.webp" alt="" />
                            
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
                            <img className="w-[199.97px] h-[96.83px]" src="/furniture/catalog/chairs/chairFour.webp" alt="" />
                            
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

                    <p className="text-2xl font-bold max-sm:text-center">Nightstands</p>

                </section>
            </main>

            <Footer />
        </div>
    );
}