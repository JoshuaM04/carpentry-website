import { useState, useEffect } from 'react';
import Footer from '../components/Footer';

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [messageVisbility, setMessageVisibility] = useState('hidden');
    const [count, setCount] = useState(0);

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
            } 
        } catch (error) {
            console.error("Failed to submit contact form:", error);
        }
    }

    return (
        <div className="contact-container flex flex-col gap-20">
            <main className="flex flex-col items-center gap-20 min-h-dvh">
                <div className="flex flex-col gap-5 text-center w-full p-5 mt-60">
                    <h2 className="text-4xl font-semibold">Contact Us</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col items-start gap-10">
                    <div className="flex flex-wrap justify-between gap-10 w-full">
                        <div className="input-container flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-slate-400 p-2 w-full" type="name" name="full-name" placeholder="Name" />
                        </div>

                        <div className="input-container flex flex-col gap-2">
                            <label htmlFor="email">Email*</label>
                            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-slate-400 p-2 w-full" type="email" name="email" placeholder="Email" required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="phone-number">Phone number</label>
                        <input id="phone-number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-slate-400 w-full p-2" type="text" name="phone-number" placeholder="Phone number" />
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="message">Message*</label>
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