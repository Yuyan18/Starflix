import Image from "next/image";

//Gallery of images with a callback function for when the user clicks an image
export default function ImageGallery({
  images,
  handleClickImage,
}: {
  images: string[];
  handleClickImage?: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-3 w-full gap-4">
      {images.map((url, i) => (
        <button
          key={i}
          className="rounded-lg overflow-hidden"
          onClick={() => handleClickImage && handleClickImage(i)}
        >
          <Image
            src={url}
            alt={`Image ${i + 1}`}
            width={200}
            height={200}
          />
        </button>
      ))}
    </div>
  );
}