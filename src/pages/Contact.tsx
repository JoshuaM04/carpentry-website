import Footer from '../components/footer';

export default function Contact() {
    return (
        <div className="contact-container flex flex-col gap-20">
            <main className="flex flex-col items-center gap-20 min-h-dvh">
                <div className="flex flex-col gap-5 text-center w-full p-5 mt-40 max-2md:mt-60">
                    <h2 className="text-4xl font-semibold">Contact Us</h2>
                </div>
                <form action="https://formspree.io/f/meebeyjw" method="post" className="flex flex-col items-start gap-10">
                    <div className="flex flex-wrap justify-between gap-10 w-full">
                        <div className="input-container flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <input id="name" className="border border-slate-400 p-2 w-full" type="name" name="full-name" placeholder="Name" />
                        </div>
                        <div className="input-container flex flex-col gap-2">
                            <label htmlFor="email">Email*</label>
                            <input id="email" className="border border-slate-400 p-2 w-full" type="email" name="email" placeholder="Email" required />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="phone-number">Phone number</label>
                        <input id="phone-number" className="border border-slate-400 w-full p-2" type="text" name="phone-number" placeholder="Phone number" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="message">Message*</label>
                        <textarea id="message" className="border border-slate-400 w-full p-2 resize-none h-100" name="message" placeholder="Message" required />
                    </div>
            
                    <button type="submit" className="font-semibold border-2 border-slate-200 bg-slate-200 rounded-md pt-2 pb-2 pl-4 pr-4 hover:cursor-pointer hover:border-slate-900">Submit</button>
                </form>
            </main>

            <Footer />
        </div>
    )
}