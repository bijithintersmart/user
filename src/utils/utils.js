import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export default function getImage(name) {
  const avatar = createAvatar(adventurer, {
    seed: name,
  });

  const profileDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
    avatar.toString()
  )}`;
  return profileDataUrl;
}
