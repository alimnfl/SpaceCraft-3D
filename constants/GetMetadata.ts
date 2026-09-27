import { Metadata } from "next";

const BASE_TITLE = "Monis: Rent Everything You Need to Work Anywhere.";
const BASE_DESCRIPTION =
  "Monis makes it easy to rent monitors, desks, chairs, computers, and more for your workspace. Get fully equipped with flexible rentals and convenient delivery in Bali.";

export function createMetadata(title?: string, description?: string): Metadata {
  return {
    title: title ? `${title} | ${BASE_TITLE}` : BASE_TITLE,
    description: description ? description : BASE_DESCRIPTION,
  };
}

export const DEFAULT_METADATA = createMetadata();
