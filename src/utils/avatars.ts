import avatar1 from "@/assets/avatars/avatar-1.jpg";
import avatar2 from "@/assets/avatars/avatar-2.jpg";
import avatar3 from "@/assets/avatars/avatar-3.jpg";
import avatar4 from "@/assets/avatars/avatar-4.jpg";
import avatar5 from "@/assets/avatars/avatar-5.jpg";
import avatar6 from "@/assets/avatars/avatar-6.jpg";
import avatar7 from "@/assets/avatars/avatar-7.jpg";

export const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
];

// Function to get a random avatar
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

// Function to get a specific avatar by index (0-6)
export const getAvatarByIndex = (index: number): string => {
  return avatars[index % avatars.length];
};
