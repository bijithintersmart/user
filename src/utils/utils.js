import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

export default function getImage({
  name = "User Name",
  flip = false,
  size = 80,
  backgroundColor = ["b6e3f4", "c0aede", "d1d4f9"],
}) {
  const avatar = createAvatar(identicon, {
    seed: name,
    flip: flip,
    size: size,
    backgroundColor: backgroundColor,
  });

  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
}
