import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateImages } from "../../functions/api.js";

export function CardWithForm({ onUpdateImages }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure the prompt is not empty
    if (!prompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    try {
      const response = await generateImages(prompt);
      console.log("====================================");
      console.log(response);
      console.log("====================================");
      onUpdateImages(await response);
      console.log("Success!", await response);
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show error message
    }
  };

  return (
    <Card className="w-full p-10">
      <CardHeader>
        <CardTitle>Create With TrendAI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-8">
            <div className="flex flex-col space-y-1.5 first-letter:py-3">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your prompts for your content here."
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Clear</Button>
        <Button type="submit" onClick={handleSubmit}>
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
}
