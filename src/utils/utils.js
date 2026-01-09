import { createAvatar } from "@dicebear/core";
import * as DicebearCollections from "@dicebear/collection";
const avatarStyles = {
  Adventurer: DicebearCollections.adventurer,
  "Adventurer Neutral": DicebearCollections.adventurerNeutral,
  Avataaars: DicebearCollections.avataaars,
  "Avataaars Neutral": DicebearCollections.avataaarsNeutral,
  "Big Ears": DicebearCollections.bigEars,
  "Big Ears Neutral": DicebearCollections.bigEarsNeutral,
  "Big Smile": DicebearCollections.bigSmile,
  Bottts: DicebearCollections.bottts,
  "Bottts Neutral": DicebearCollections.botttsNeutral,
  Croodles: DicebearCollections.croodles,
  "Croodles Neutral": DicebearCollections.croodlesNeutral,
  Dylan: DicebearCollections.dylan,
  "Fun Emoji": DicebearCollections.funEmoji,
  Glass: DicebearCollections.glass,
  Icons: DicebearCollections.icons,
  Identicon: DicebearCollections.identicon,
  Lorelei: DicebearCollections.lorelei,
  "Lorelei Neutral": DicebearCollections.loreleiNeutral,
  Micah: DicebearCollections.micah,
  Miniavs: DicebearCollections.miniavs,
  Notionists: DicebearCollections.notionists,
  "Notionists Neutral": DicebearCollections.notionistsNeutral,
  "Open Peeps": DicebearCollections.openPeeps,
  Personas: DicebearCollections.personas,
  "Pixel Art": DicebearCollections.pixelArt,
  "Pixel Art Neutral": DicebearCollections.pixelArtNeutral,
  Rings: DicebearCollections.rings,
  Shapes: DicebearCollections.shapes,
  Thumbs: DicebearCollections.thumbs,
};

export default function getImage({
  name = "User Name",
  flip = false,
  size = 80,
  backgroundColor = ["b6e3f4", "c0aede", "d1d4f9"],
  imageType = "Identicon",
}) {
  const selectedStyle =
    avatarStyles[imageType] || DicebearCollections.identicon;

  const avatar = createAvatar(selectedStyle, {
    seed: name,
    flip: flip,
    size: size,
    backgroundColor: backgroundColor,
  });

  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
}
