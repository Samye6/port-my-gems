import fitgirl1 from "@/assets/ephemeral-photos/fitgirl-1.jpg";
import fitgirl2 from "@/assets/ephemeral-photos/fitgirl-2.jpg";
import fitgirl3 from "@/assets/ephemeral-photos/fitgirl-3.jpg";
import fitgirl4 from "@/assets/ephemeral-photos/fitgirl-4.jpg";
import fitgirl5 from "@/assets/ephemeral-photos/fitgirl-5.jpg";
import fitgirl6 from "@/assets/ephemeral-photos/fitgirl-6.jpg";
import fitgirl7 from "@/assets/ephemeral-photos/fitgirl-7.jpg";
import fitgirl8 from "@/assets/ephemeral-photos/fitgirl-8.jpg";
import fitgirl9 from "@/assets/ephemeral-photos/fitgirl-9.jpg";
import fitgirl10 from "@/assets/ephemeral-photos/fitgirl-10.jpg";

export const fitgirlPhotos = [
  fitgirl1,
  fitgirl2,
  fitgirl3,
  fitgirl4,
  fitgirl5,
  fitgirl6,
  fitgirl7,
  fitgirl8,
  fitgirl9,
  fitgirl10,
];

export const getRandomFitgirlPhoto = () => {
  const randomIndex = Math.floor(Math.random() * fitgirlPhotos.length);
  return fitgirlPhotos[randomIndex];
};
