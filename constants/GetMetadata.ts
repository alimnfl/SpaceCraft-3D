import { Metadata } from "next";

const BASE_TITLE = "SpaceCraft: Create Your Perfect Space.";

const BASE_DESCRIPTION =
  "SpaceCraft makes it easy to design and customize your space with furniture, equipment, and more. Arrange everything in 3D and create a space that works for you.";

export function createMetadata(title?: string, description?: string): Metadata {
  return {
    title: title ? `${title} | ${BASE_TITLE}` : BASE_TITLE,
    description: description ? description : BASE_DESCRIPTION,
  };
}

export const DEFAULT_METADATA = createMetadata();
