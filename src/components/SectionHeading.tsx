interface SectionHeadingProps {
    eyebrow?: string;
    left: string;
    right?: string;
    inverted?: boolean;
}

/* The split display heading used across every section — "LEFT — RIGHT." */
export default function SectionHeading({ eyebrow, left, right, inverted = false }: SectionHeadingProps) {
    return (
        <div className="section-heading flex flex-col gap-6 w-full">
            {
                eyebrow && <p className={`${inverted ? 'text-clay-400' : 'text-stone-500'} eyebrow`}>{eyebrow}</p>
            }

            <div className="flex items-center gap-6 w-full max-xsm:flex-col max-xsm:items-start max-xsm:gap-2">
                <h2 className="display display-xl">{left}</h2>

                {
                    right && (
                        <>
                            <div className="flex justify-center flex-1 max-xsm:hidden">
                                <span className="bg-current opacity-40 w-full max-w-24 h-px"></span>
                            </div>

                            <h2 className="display display-xl">{right}</h2>
                        </>
                    )
                }
            </div>
        </div>
    );
}
