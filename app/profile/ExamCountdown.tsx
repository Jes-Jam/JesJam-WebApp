export const ExamCountdown = () => {
    // Set BacII exam date to 2025-06-10
    const examDate = new Date("2025-06-31");
    const today = new Date();
    // Calculate days left
    const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // TODO: Change this to some random quote API
    // Array of motivation quotes 
    const quotes = [
        "Every hour of study brings you closer to success.",
        "Your future is worth the hard work today.",
        "Small progress is still progress.",

        // Add more quotes...
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return (
        <div className="bg-gradient-to-r from-sky-500/80 to-[#2980B9]/80 rounded-xl border-2 border-b-4 border-slate-200 shadow-sm p-6 text-white">
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">BACCII Countdown</h3>
                    <p className="text-3xl font-bold mt-2">{daysLeft} days left</p>
                </div>
                <div className="border-t border-white/20 pt-4">
                    <p className="italic">"{randomQuote}"</p>
                </div>
            </div>
        </div>
    );
}