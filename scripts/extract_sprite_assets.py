from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "watermarked_img_14248841167161989406.png.png"
OUT = ROOT / "src" / "assets"

FRAME_SIZE = (190, 340)

WALK_REGIONS = [
    (20, 22, 188, 392),
    (188, 22, 356, 392),
    (340, 22, 540, 392),
    (512, 22, 724, 392),
    (708, 22, 906, 392),
    (332, 420, 544, 790),
    (526, 420, 738, 790),
    (716, 420, 928, 790),
]

VICTORY_REGION = (926, 8, 1112, 388)
DAMAGE_REGION = (1228, 42, 1422, 392)


def is_background_like(pixel):
    r, g, b, a = pixel
    if a == 0:
        return False
    if not (70 <= r <= 190 and 70 <= g <= 190 and 70 <= b <= 190):
        return False
    return max(r, g, b) - min(r, g, b) <= 18


def remove_connected_background(image):
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size
    queue = deque()
    seen = set()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in seen or x < 0 or y < 0 or x >= width or y >= height:
            continue
        seen.add((x, y))

        if not is_background_like(pixels[x, y]):
            continue

        pixels[x, y] = (0, 0, 0, 0)
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    return image


def trim_and_stage(image, frame_size=FRAME_SIZE):
    bbox = image.getbbox()
    if not bbox:
        return Image.new("RGBA", frame_size, (0, 0, 0, 0))

    subject = image.crop(bbox)
    frame = Image.new("RGBA", frame_size, (0, 0, 0, 0))
    x = (frame_size[0] - subject.width) // 2
    y = frame_size[1] - subject.height
    frame.alpha_composite(subject, (x, y))
    return frame


def crop_frame(source, region, frame_size=FRAME_SIZE):
    return trim_and_stage(remove_connected_background(source.crop(region)), frame_size)


def save_strip(frames, path):
    width, height = frames[0].size
    strip = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * width, 0))
    strip.save(path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE)

    walk_frames = [crop_frame(source, region) for region in WALK_REGIONS]
    save_strip(walk_frames, OUT / "player-walk-strip.png")

    crop_frame(source, VICTORY_REGION, (220, 360)).save(OUT / "player-victory.png")
    crop_frame(source, DAMAGE_REGION, (210, 350)).save(OUT / "player-damage.png")


if __name__ == "__main__":
    main()
