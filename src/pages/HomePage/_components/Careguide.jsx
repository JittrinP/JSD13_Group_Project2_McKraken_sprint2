import { useState, useEffect } from "react";

export default function Careguide() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-background p-4 md:p-12 font-body text-neutral flex items-center justify-center">
            {/* Main Container Card */}
            <div className="bg-background border border-border rounded-4xl overflow-hidden shadow-sm max-w-5xl w-full grid grid-cols-1 md:grid-cols-2">

                {/* Left Section: Content */}
                <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center">

                    {/* Sub-header / Label */}
                    <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase mb-4">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                        <span>CARE INSTRUCTIONS</span>
                    </div>

                    {/* Heading */}
                    <h1 className="font-display text-3xl sm:text-4xl md:text-[42px] font-bold text-primary leading-tight mb-4">
                        Keep Them Blooming
                    </h1>

                    {/* Description */}
                    <p className="text-neutral text-sm sm:text-base leading-relaxed mb-8">
                        Our floral arrangements are designed to bring joy that lasts.<br className="hidden sm:inline" /> Follow these simple, expert steps to ensure your blooms stay vibrant, fresh, and beautiful for as long as possible.
                    </p>

                    {/* Quick Tips List */}
                    <div className="space-y-6 mb-8">
                        {/* Item 1 */}
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 text-primary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L3 3m6.121 6.121L3 15" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-neutral">Trim the Stems:</h3>
                                <p className="text-xs sm:text-sm text-neutral/80 leading-normal">
                                    Cut 1-2 inches off the stems at a 45-degree angle under running water before placing them in your vase.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 text-primary">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-neutral">Prep & Clean:</h3>
                                <p className="text-xs sm:text-sm text-neutral/80 leading-normal">
                                    Remove any leaves that sit below the waterline to keep the water clean and prevent bacterial growth.
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 text-primary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-neutral">Fresh Water Routine:</h3>
                                <p className="text-xs sm:text-sm text-neutral/80 leading-normal">
                                    Change the water every 2 days, rinse the vase, and add flower food to nourish your stems.
                                </p>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="flex items-start gap-3.5">
                            <div className="mt-0.5 text-primary">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-neutral">Find the Perfect Spot:</h3>
                                <p className="text-xs sm:text-sm text-neutral/80 leading-normal">
                                    Display your flowers in a cool area away from direct sunlight, heating drafts, and ripening fruit.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="inline-block px-7 py-3 rounded-full border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-[#FBF9F8] transition-all duration-200 cursor-pointer"
                        >
                            Read Full Care Guide
                        </button>
                    </div>
                </div>

                {/* Right Section: Image Container */}
                <div className="bg-accent min-h-75 md:min-h-full flex items-center justify-center relative">
                    <img
                        src="src/assets/Flower_care.png"
                        alt="Flower Care"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Full Care Guide Modal Pop-up */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white/40 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 transition-all"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-[#FBF9F8] p-6 sm:p-8 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E5E0DA]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Label */}
                        <div className="text-primary font-bold text-xs tracking-wider uppercase mb-2">
                            CARE INSTRUCTIONS
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
                            Complete Fresh-Cut Flower Care Guide
                        </h2>

                        <p className="text-sm text-neutral leading-relaxed mb-6">
                            Thank you for choosing our flowers! With just a little love and attention, you can significantly extend the life and beauty of your fresh blooms. Here is our comprehensive step-by-step guide to keeping your flowers fresh, vibrant, and healthy for as long as possible.
                        </p>

                        {/* Guide Content */}
                        <div className="space-y-6 text-sm text-neutral">
                            <div>
                                <h3 className="font-display text-lg font-bold text-primary mb-2">
                                    Step 1: Unpacking & Initial Preparation
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral/80">
                                    <li><strong>Unwrap Gently:</strong> Carefully remove all protective paper, plastic sleeves, and decorative ribbons so the stems can breathe freely.</li>
                                    <li><strong>Strip Submerged Leaves:</strong> Gently strip off all leaves and foliage that will fall below the vase's waterline. Foliage left underwater rapidly decays, creating harmful bacteria that clog stems and shorten flower lifespan.</li>
                                    <li><strong>Angled Stem Cut:</strong> Using sharp shears or a clean knife, trim 1-2 inches (2.5-5 cm) off the bottom of each stem at a 45-degree angle. Cutting at an angle increases the surface area for water absorption and prevents stems from sitting flat against the bottom of the vase.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-primary mb-2">
                                    Step 2: Vase Setup & Water Quality
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral/80">
                                    <li><strong>Sanitize Your Vase:</strong> Always use a spotlessly clean vase. Wash it thoroughly with warm water and soap before use to eliminate residual bacteria.</li>
                                    <li><strong>Water Temperature:</strong> Fill the vase 3/4 full with cool or room-temperature freshwater.</li>
                                    <li><strong>Nourish with Flower Food:</strong> Mix in the commercial flower food packet provided. Flower food contains essential nutrients to feed the blooms, acidifiers to regulate water pH, and mild biocides to suppress bacterial growth.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-primary mb-2">
                                    Step 3: Ideal Placement & Environment
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral/80">
                                    <li><strong>Keep It Cool:</strong> Place your arrangement in a cool, climate-controlled room (ideally between 18°C-22°C or 65°F-72°F).</li>
                                    <li><strong>Avoid Direct Heat & Drafts:</strong> Keep flowers away from direct sunlight, radiators, air conditioners, ceiling fans, and electronics that generate heat.</li>
                                    <li><strong>Keep Away from Fruit:</strong> Never place flowers near ripening fruit (especially bananas and apples). Fruit emits ethylene gas, an invisible plant hormone that accelerates wilting and causes premature petal loss.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-primary mb-2">
                                    Step 4: Daily Maintenance Routine
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral/80">
                                    <li><strong>Refresh Water Every 2 Days:</strong> Empty the vase completely every 48 hours, rinse the container, and refill with fresh water and flower food.</li>
                                    <li><strong>Re-trim the Stems:</strong> Each time you change the water, slice another 0.5 inch (1 cm) off the stems at an angle to clear clogged vascular tissues and reopen water channels.</li>
                                    <li><strong>Prune Fading Blooms:</strong> Immediately pick off wilting petals or dead leaves. This prevents mold spores from spreading and directs vital nutrients to the remaining healthy blooms.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-primary mb-2">
                                    Pro-Tips for Specific Flowers
                                </h3>
                                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-neutral/80">
                                    <li><strong>Roses:</strong> If a rose head begins to droop prematurely, submerge the entire stem and bloom in cool water for 30 minutes, then re-cut the stem underwater.</li>
                                    <li><strong>Hydrangeas:</strong> Hydrangeas absorb water through their petals as well as their stems. If they look dehydrated, mist the petals lightly with fresh water or dip the flower head upside down in a bowl of room-temperature water for a few minutes.</li>
                                    <li><strong>Tulips & Lilies:</strong> Tulips keep growing in the vase and will naturally bend toward light sources. For lilies, gently snip off pollen-bearing anthers inside the petals as soon as they open to prevent staining on fabric and prolong the bloom's life.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="mt-8 pt-4 border-t border-[#E5E0DA] flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 rounded-full bg-primary text-[#FBF9F8] font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}