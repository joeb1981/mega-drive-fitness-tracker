from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_CANDIDATES = [
    ROOT / "dog_reference.png",
    Path(r"C:\Users\jrbri\Desktop\Gemini_Generated_Image_ue667tue667tue66.png"),
]
OUT = ROOT / "src" / "assets"
FRAME_SIZE = (360, 190)

# Complete all-fours chocolate lab frames from the reference sheet.
SOURCE_FRAMES = [
    (18, 54, 362, 210),
    (578, 56, 900, 214),
    (20, 240, 360, 392),
    (604, 240, 900, 392),
]

# Ping-pong the cycle to make it longer and less snappy.
ANIMATION_ORDER = [0, 1, 2, 3, 2, 1, 0, 3]


def is_background_like(pixel):
    r, g, b, a = pixel
    if a == 0:
        return False
    if not (70 <= r <= 190 and 70 <= g <= 190 and 70 <= b <= 190):
        return False
    return max(r, g, b) - min(r, g, b) <= 22


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


def trim_and_stage(image):
    bbox = image.getbbox()
    if not bbox:
        return Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))

    subject = image.crop(bbox)
    frame = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
    x = (FRAME_SIZE[0] - subject.width) // 2
    y = FRAME_SIZE[1] - subject.height
    frame.alpha_composite(subject, (x, y))
    return frame


def is_collar_orange(r, g, b):
    return r > 150 and 45 <= g <= 125 and b < 45


def is_fur_pixel(r, g, b):
    if is_collar_orange(r, g, b):
        return False
    if r < 24 and g < 24 and b < 28:
        return False
    if b > 95:
        return False
    return 42 <= r <= 150 and 18 <= g <= 95 and 8 <= b <= 82 and r >= g >= b * 0.55


def recolor_fox_red(frame):
    frame = frame.copy().convert("RGBA")
    pixels = frame.load()
    width, height = frame.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue

            if is_collar_orange(r, g, b):
                brightness = (r + g + b) / 3 / 255
                pixels[x, y] = (
                    int(45 + 95 * brightness),
                    int(175 + 70 * brightness),
                    int(210 + 45 * brightness),
                    a,
                )
                continue

            if is_fur_pixel(r, g, b):
                brightness = max(0.0, min(1.0, (0.45 * r + 0.35 * g + 0.2 * b - 32) / 118))
                dark = (112, 42, 14)
                mid = (197, 91, 28)
                light = (232, 132, 45)
                if brightness < 0.58:
                    t = brightness / 0.58
                    colour = tuple(int(dark[i] + (mid[i] - dark[i]) * t) for i in range(3))
                else:
                    t = (brightness - 0.58) / 0.42
                    colour = tuple(int(mid[i] + (light[i] - mid[i]) * t) for i in range(3))
                pixels[x, y] = (*colour, a)

    return frame


def make_frames():
    source_path = next((path for path in SOURCE_CANDIDATES if path.exists()), None)
    if source_path is None:
        raise FileNotFoundError("Dog reference sprite sheet not found.")

    source = Image.open(source_path)
    base_frames = [trim_and_stage(remove_connected_background(source.crop(region))) for region in SOURCE_FRAMES]
    return [base_frames[index] for index in ANIMATION_ORDER]


def save_strip(frames, path):
    width, height = frames[0].size
    strip = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * width, 0))
    strip.save(path)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    chocolate_frames = make_frames()
    save_strip(chocolate_frames, OUT / "dog-chocolate-strip.png")
    save_strip([recolor_fox_red(frame) for frame in chocolate_frames], OUT / "dog-fox-red-strip.png")


if __name__ == "__main__":
    main()
