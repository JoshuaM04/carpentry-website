import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [messageVisbility, setMessageVisibility] = useState('hidden');
    const [count, setCount] = useState(0);
    const [imageUpload, setImageUpload] = useState<string>('No file chosen');

    useEffect(() => {
        console.log(count);
        const timer = setTimeout(() => { setMessageVisibility('hidden'); setCount(0) }, 5000);

        return () => {
            clearTimeout(timer);
        }
    }, [count])
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessageVisibility('block');
        setCount((prevIndex) => prevIndex + 1);
        
        const formData = {
            name,
            email,
            phone,
            message,
        };

        try {
            const response = await fetch("https://formspree.io/f/meebeyjw", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
                setImageUpload('No file chosen');
            } 
        } catch (error) {
            console.error("Failed to submit contact form:", error);
        }
    }

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const images = event.target.files;

        if (images && images.length > 0) {
            setImageUpload(images[0].name);
        } else {
            setImageUpload('No file chosen');
        }
    };

    return (
        <div className="contact-container flex flex-col gap-20">
            <main className="flex flex-col items-center gap-20 min-h-dvh">
                <div className="flex flex-col gap-5 text-center w-full p-5 mt-60">
                    <h2 className="text-4xl font-semibold">Contact Us</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-start gap-10">
                    <div className="flex flex-wrap justify-between gap-10 w-full">
                        <div className="flex flex-col gap-2 max-3xl:w-full w-[48%]">
                            <label htmlFor="name">Name<span className="text-red-500">*</span></label>
                            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-slate-400 p-2 w-full" type="name" name="full-name" placeholder="Name" required />
                        </div>

                        <div className="flex flex-col gap-2 max-3xl:w-full w-[48%]">
                            <label htmlFor="email">Email<span className="text-red-500">*</span></label>
                            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-slate-400 p-2 w-full" type="email" name="email" placeholder="Email" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="phone-number">Phone number<span className="text-red-500">*</span></label>
                        <input id="phone-number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-slate-400 w-full p-2" type="text" name="phone-number" placeholder="Phone number" required />
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <label htmlFor="imgUpload" className="text-sm font-semibold text-white bg-black min-w-27 p-2 hover:cursor-pointer">
                            Upload Image
                        </label>
                        
                        <input id="imgUpload" type="file" accept="image/*" onChange={handleImage} className="hidden" />

                        <span>
                            {imageUpload}
                        </span>

                        <button onClick={() => setImageUpload('No file chosen')} className={`${imageUpload === 'No file chosen' ? 'hidden' : 'block'} hover:cursor-pointer`}>
                            <svg className="size-5 stroke-red-500 fill-red-500" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path></g></svg>
                        </button>
                    </div>


                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="message">Message<span className="text-red-500">*</span></label>
                        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="border border-slate-400 w-full p-2 resize-none h-100" name="message" placeholder="Message" required />
                    </div>
            
                    <div className="flex gap-5">
                        <button type="submit" className="text-sm font-semibold text-white bg-black pt-2 pb-2 pl-5 pr-6 w-fit h-10 hover:cursor-pointer">Submit</button>
                        
                        <div>
                            <div className={`${messageVisbility === 'hidden' ? 'hidden' : 'block'} font-semibold uppercase bg-green-100 p-2 w-fit h-9`}>
                                <p>Submitted</p>
                            </div>

                            <div className={`${messageVisbility === 'hidden' ? 'hidden' : 'block animate-timer-forms-message'} bg-black h-1`}></div>
                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    )
}