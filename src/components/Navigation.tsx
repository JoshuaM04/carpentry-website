import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DialogTrigger, Modal, Dialog, Heading, Button } from 'react-aria-components/Modal';
import Cart from './Cart';

const LINKS = [
    { to: '/home', label: 'home' },
    { to: '/gallery', label: 'gallery' },
    { to: '/contact', label: 'contact' },
    { to: '/about', label: 'about' }
];

type NavigationProps = React.ComponentProps<typeof Cart>;

export default function Navigation({ cart, setCart }: NavigationProps) {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    const isHomePage = location.pathname === '/' || location.pathname === '/home';
    const isTransparent = isHomePage && !scrolled;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const brand = (
        <div className="flex flex-col leading-none">
            <p className="display text-[0.8125rem] tracking-[0.3em]">WoodWork</p>
            <p className="display text-[0.8125rem] tracking-[0.3em]">Creations</p>
        </div>
    );

    return (
        <header>
            <nav className={`${isTransparent ? 'bg-transparent border-transparent' : 'bg-bark-900/95 border-bone-50/10 backdrop-blur-sm'} navigation-component fixed top-0 left-0 text-bone-50 border-b w-full h-(--header-h) z-30 transition-colors duration-500`}>
                <div className="desktop-layout flex justify-between items-center h-full px-8 relative max-2md:hidden">
                    <div className="flex gap-12">
                        {
                            LINKS.slice(0, 2).map((item) => (
                                <Link key={item.to} to={item.to} className="link-underline eyebrow">{item.label}</Link>
                            ))
                        }
                    </div>

                    <Link to="/home" className="left-[50%] translate-x-[-50%] absolute" aria-label="WoodWork Creations home">{brand}</Link>

                    <div className="flex items-center gap-12">
                        {
                            LINKS.slice(2).map((item) => (
                                <Link key={item.to} to={item.to} className="link-underline eyebrow">{item.label}</Link>
                            ))
                        }

                        <Cart cart={cart} setCart={setCart} />
                    </div>
                </div>

                <div className="mobile-layout flex justify-between items-center h-full gap-10 px-6 2md:hidden">
                    <Link to="/home" aria-label="WoodWork Creations home">{brand}</Link>

                    <div className="flex items-center gap-6">
                        <Cart cart={cart} setCart={setCart} />

                        <DialogTrigger>
                            <Button aria-label="Open drop-down menu navigation" className="hover:cursor-pointer">
                                <svg className="stroke-bone-50 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 7L4 7" strokeWidth="1.5" strokeLinecap="round"></path><path d="M20 12L4 12" strokeWidth="1.5" strokeLinecap="round"></path><path d="M20 17L4 17" strokeWidth="1.5" strokeLinecap="round"></path></svg>
                            </Button>

                            <Modal className="modal-display fixed left-[50%] top-[50%] translate-[-50%] text-bone-50 bg-bark-950 w-full h-full p-6 font-sans z-40">
                                <Dialog className="flex flex-col justify-between h-full outline-none">
                                    <div className="flex flex-col gap-16">
                                        <div className="flex justify-between items-center">
                                            <Heading className="flex flex-col leading-none">
                                                <span className="display text-[0.8125rem] tracking-[0.3em]">WoodWork</span>
                                                <span className="display text-[0.8125rem] tracking-[0.3em]">Creations</span>
                                            </Heading>

                                            <Button aria-label="Close drop-down menu navigation" className="hover:cursor-pointer" slot="close">
                                                <svg className="stroke-bone-50 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L16.8995 7.10051" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7 7.00001L16.8995 16.8995" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                            </Button>
                                        </div>

                                        <div className="flex flex-col">
                                            {
                                                LINKS.map((item) => (
                                                    <Button key={item.to} className="flex justify-between items-center border-b border-bone-50/15 py-5 w-full text-left hover:cursor-pointer" slot="close">
                                                        <Link to={item.to} className="display display-lg">{item.label}</Link>
                                                        <span className="eyebrow text-clay-400">0{LINKS.indexOf(item) + 1}</span>
                                                    </Button>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 text-clay-400">
                                        <p className="eyebrow">San Marcos · Local pickup</p>
                                        <p className="eyebrow">Hand crafted · Real materials · Family owned</p>
                                    </div>
                                </Dialog>
                            </Modal>
                        </DialogTrigger>
                    </div>
                </div>
            </nav>
        </header>
    );
}
