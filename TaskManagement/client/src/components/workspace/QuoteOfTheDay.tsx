// import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Quote } from "lucide-react";
import { Button } from "../ui/button";

const QuoteOfTheDay = () => {
	// const [quoteOfTheDay, setQuoteOfTheDay] = useState<string>("");
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Quote of the day</h2>
					<Button
						variant="ghost"
						className="text-blue-500 hover:text-blue-600">
						View
					</Button>
				</div>
				<p className="text-muted-foreground text-sm">
					<Quote>fsdsfsdf</Quote>
				</p>
			</CardContent>
		</Card>
	);
};

export default QuoteOfTheDay;
