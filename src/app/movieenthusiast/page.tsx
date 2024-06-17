"use client";

import { useState } from "react";
import { describeMovieScenePrompt } from "@/ai/prompts";
import TagCloud from "@/components/TagCloud";
import ImageGallery from "@/components/ImageGallery";
import { getGroqCompletion } from "@/ai/groq";
import { generateImageFal, generateVoice } from "@/ai/fal";
import { useRouter } from "next/navigation";

type Movie = {
  name: string;
  description: string;
  imageUrl: string;
  critique: string;
};

//An example of making a movie enthusiast game
export default function MovieEnthusiastPage() {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string>("Selected Keywords...");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [message, setMessage] = useState<string>("Create Movie Scene");
  const [critiqueAudio, setCritiqueAudio] = useState<string>("");

  async function handleCreate() {
    setMessage("Generating movie scene...");

    //generate the movie name
    const name = await getGroqCompletion(
      `Create a movie name based on the following keywords: ${keywords}`,
      10,
      "Generate a short, catchy movie name. Only output the name with no other text or explanation."
    );

    //generate the image description
    const description = await getGroqCompletion(
      `Describe the most iconic scene of a movie called "${name}" that includes: ${keywords}`,
      64,
      describeMovieScenePrompt
    );

    //create the image
    const imageUrl = await generateImageFal(description, "landscape_16_9");

    setMessage("Generating critique...");

    //generate a critique
    const critique = await getGroqCompletion(
      `The player made a movie scene described as follows: ${description}`,
      64,
      "Critique the merit of the movie scene"
    );

    //update the movie object and add to our state to display it
    const newMovie = {
      name,
      description,
      imageUrl,
      critique,
    };
    setMovies([...movies, newMovie]);
    setSelectedMovie(newMovie);
    setMessage("Create Movie Scene");

    //read the critique - do this asynchronously as it takes forever
    generateVoice(critique).then((audio) => setCritiqueAudio(audio));
  }

  function handleNext() {
    if (selectedMovie) {
      router.push(`/map?movie=${encodeURIComponent(selectedMovie.name)}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col items-center">
          <TagCloud
            prompt="A description of an iconic movie scene"
            totalTags={10}
            handleSelect={(tags) => setKeywords(tags.join(", "))}
          />
          <button className="p-4 bg-white text-black rounded-lg hover:shadow mt-4" onClick={handleCreate}>
            {message}
          </button>
          {selectedMovie && (
            <div className="flex flex-col pb-4 items-center">
              <span>{selectedMovie.name}</span>
              <span>{selectedMovie.description}</span>
              {critiqueAudio !== "" && (
                <audio
                  className="w-full my-4"
                  src={critiqueAudio}
                  controls
                  autoPlay
                />
              )}
              <img src={selectedMovie.imageUrl} />
              <button
                className="p-4 mt-4 self-end bg-white text-black rounded-lg hover:shadow"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}
          <ImageGallery
            images={movies.map((a) => a.imageUrl)}
            handleClickImage={(id) => setSelectedMovie(movies[id])}
          />
        </div>
      </div>
    </main>
  );
}