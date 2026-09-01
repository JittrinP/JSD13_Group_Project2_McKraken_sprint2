import { useState } from "react";

export default function cpn_careguide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-background rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between">
            <div>

                <p>CARE INSTRUCTIONS</p>

                <h1>Keep Them Blooming</h1>

                <p>Our floral arrangements are designed to bring joy that lasts.<br /> Follow these simple, expert steps to ensure your blooms stay vibrant, fresh, and beautiful for as long as possible.</p>

                <div>
                    <p>Trim the Stems:<br /> Cut 1-2 inches off the stems at a 45-degree angle under running water before placing them in your vase.</p>
                    <p>Prep & Clean:<br /> Remove any leaves that sit below the waterline to keep the water clean and prevent bacterial growth.</p>
                    <p>Fresh Water Routine:<br /> Change the water every 2 days, rinse the vase, and add flower food to nourish your stems.</p>
                    <p>Find the Perfect Spot:<br /> Display your flowers in a cool area away from direct sunlight, heating drafts, and ripening fruit.</p>
                </div>

                <button onClick={() => setIsOpen(true)}>
                    Read Full Care Guide
                </button>

            </div>
            <div>
                <img src="" alt="" />
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-2xl max-w-lg w-full">

                        <p>CARE INSTRUCTIONS</p>

                        <h1>Complete Fresh-Cut Flower Care Guide</h1>

                        <p>Thank you for choosing our flowers! With just a little love and attention, you can signiﬁcantly extend the life and beauty of your fresh blooms. Here is our comprehensive step-by-step guide to keeping your flowers fresh, vibrant, and healthy for as long as possible.</p>

                        <h2>Step 1: Unpacking & Initial Preparation</h2>
                            <ul>
                                <li>Unwrap Gently: Carefully remove all protective paper, plastic sleeves, and decorative ribbons so the stems can breathe freely.</li>
                                <li>Strip Submerged Leaves: Gently strip off all leaves and foliage that will fall below the vase's waterline. Foliage left underwater rapidly decays, creating harmful bacteria that clog stems and shorten flower lifespan.</li>
                                <li>Angled Stem Cut: Using sharp shears or a clean knife, trim 1-2 inches (2.5-5 cm) off the bottom of each stem at a 45-degree angle. Cutting at an angle increases the surface area for water absorption and prevents stems from sitting flat against the bottom of the vase.</li>
                            </ul>
                        <h2>Step 2: Vase Setup & Water Quality</h2>
                            <ul>
                                <li>Sanitize Your Vase: Always use a spotlessly clean vase. Wash it thoroughly with warm water and soap before use to eliminate residual bacteria.</li>
                                <li>Water Temperature: Fill the vase 3/4 full with cool or room-temperature freshwater.</li>
                                <li>Nourish with Flower Food: Mix in the commercial flower food packet provided. Flower food contains essential nutrients to feed the blooms, acidifiers to regulate water pH, and mild biocides to suppress bacterial growth.</li>
                            </ul>
                        <h2>Step 3: Ideal Placement & Environment</h2>
                            <ul>
                                <li>Keep It Cool: Place your arrangement in a cool, climate-controlled room (ideally between 18°C-22°C or 65°F-72°F).</li>
                                <li>Avoid Direct Heat & Drafts: Keep flowers away from direct sunlight, radiators, air conditioners, ceiling fans, and electronics that generate heat.</li>
                                <li>Keep Away from Fruit: Never place flowers near ripening fruit (especially bananas and apples). Fruit emits ethylene gas, an invisible plant hormone that accelerates wilting and causes premature petal loss.</li>
                            </ul>
                        <h2>Step 4: Daily Maintenance Routine</h2>
                            <ul>
                                <li>Refresh Water Every 2 Days: Empty the vase completely every 48 hours, rinse the container, and refill with fresh water and flower food.</li>
                                <li>Re-trim the Stems: Each time you change the water, slice another 0.5 inch (1 cm) off the stems at an angle to clear clogged vascular tissues and reopen water channels.</li>
                                <li>Prune Fading Blooms: Immediately pick off wilting petals or dead leaves. This prevents mold spores from spreading and directs vital nutrients to the remaining healthy blooms.</li>
                            </ul>
                        <h2>Pro-Tips for Specific Flowers</h2>
                            <ul>
                                <li>Roses: If a rose head begins to droop prematurely, submerge the entire stem and bloom in cool water for 30 minutes, then re-cut the stem underwater.</li>
                                <li>Hydrangeas: Hydrangeas absorb water through their petals as well as their stems. If they look dehydrated, mist the petals lightly with fresh water or dip the flower head upside down in a bowl of room-temperature water for a few minutes.</li>
                                <li>Tulips & Lilies: Tulips keep growing in the vase and will naturally bend toward light sources. For lilies, gently snip off pollen-bearing anthers inside the petals as soon as they open to prevent staining on fabric and prolong the bloom's life.</li>
                            </ul>


                        <button onClick={() => setIsOpen(false)}>Close</button>

                    </div>
                </div>
            )}
        </div>
    );
}
