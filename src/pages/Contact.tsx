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
            if (images[0].name.length > 15) {
                setImageUpload(images[0].name.substring(0, 16) + "...");
            } else {
                setImageUpload(images[0].name);
            }
        } else {
            setImageUpload('No file chosen');
        }
    };

    return (
        <div className="contact-container flex flex-col">
            <main className="flex flex-col">
                <section className="flex flex-col justify-end gap-6 text-bone-50 bg-bark-950 px-6 pt-(--header-h) pb-14 relative overflow-hidden">
                    <div className="flex flex-col gap-6 pt-20">
                        <p className="eyebrow text-clay-400">Contact</p>
                        <h1 className="display display-hero">Tell us what<br />you have in mind.</h1>
                    </div>
                </section>

                <section className="grid grid-cols-[1fr_1.6fr] gap-16 px-6 py-24 max-2md:grid-cols-1 max-2md:gap-10 max-2md:py-16">
                    <div className="flex flex-col gap-10 h-fit 2md:sticky 2md:top-32">
                        <div className="flex flex-col gap-3">
                            <p className="eyebrow text-stone-500">Commissions</p>
                            <p className="text-sm leading-relaxed text-stone-600">Send measurements, a stain you like, or a reference photo. We will come back with timing and a price.</p>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-bark-900/15 pt-6">
                            <p className="eyebrow text-stone-500">Pickup</p>
                            <p className="text-sm leading-relaxed text-stone-600">San Marcos, Texas — local pickup only for now.</p>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-bark-900/15 pt-6">
                            <p className="eyebrow text-stone-500">Build time</p>
                            <p className="text-sm leading-relaxed text-stone-600">One to three weeks depending on the piece.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-8 w-full">
                        <div className="grid grid-cols-2 gap-8 w-full max-xsm:grid-cols-1">
                            <div className="flex flex-col gap-2">
                                <label className="eyebrow text-stone-500" htmlFor="name">Name<span className="text-espresso-500">*</span></label>
                                <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="field" type="name" name="full-name" placeholder="Name" required />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="eyebrow text-stone-500" htmlFor="email">Email<span className="text-espresso-500">*</span></label>
                                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" type="email" name="email" placeholder="Email" required />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="eyebrow text-stone-500" htmlFor="phone-number">Phone number<span className="text-espresso-500">*</span></label>
                            <input id="phone-number" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" type="text" name="phone-number" placeholder="Phone number" required />
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label className="eyebrow text-stone-500" htmlFor="message">Message<span className="text-espresso-500">*</span></label>
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-none h-64" name="message" placeholder="Message" required />
                        </div>

                        <div className="flex flex-wrap items-center gap-5 border-t border-bark-900/15 pt-6 w-full">
                            <label htmlFor="imgUpload" className="btn btn-ghost" >
                                Upload image
                            </label>

                            <input id="imgUpload" type="file" accept="image/*" onChange={handleImage} className="hidden" />

                            <span className="micro text-stone-500">{imageUpload}</span>

                            <button type="button" onClick={() => setImageUpload('No file chosen')} aria-label="Clear selected image" className={`${imageUpload === 'No file chosen' ? 'hidden' : 'block'} hover:cursor-pointer`}>
                                <svg className="size-4 fill-stone-500" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg"><path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path></svg>
                            </button>
                        </div>

                        <div className="flex items-start gap-5">
                            <button type="submit" className="btn btn-solid">Submit</button>

                            <div className={`${messageVisbility === 'hidden' ? 'hidden' : 'block'} w-fit`}>
                                <div className="flex items-center bg-bark-900 text-bone-50 eyebrow px-4 h-9">
                                    <p>Submitted</p>
                                </div>

                                <div key={count} className="bg-espresso-500 h-1 animate-timer-forms-message"></div>
                            </div>
                        </div>
                    </form>
                </section>
            </main>

            <Footer />
        </div>
    )
}
