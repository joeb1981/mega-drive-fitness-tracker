from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "assets"
FRAME = (128, 88)
SCALE = 3


def rect(draw, xy, fill, outline="#0b0714", width=2):
    draw.rectangle(xy, fill=fill, outline=outline, width=width)


def poly(draw, points, fill, outline="#0b0714", width=2):
    draw.polygon(points, fill=fill)
    draw.line(points + [points[0]], fill=outline, width=width, joint="curve")


def draw_dog(fur, dark, collar, frame_index):
    image = Image.new("RGBA", FRAME, (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    bob = 1 if frame_index % 2 else 0
    leg_phase = frame_index % 4
    tail_angle = [0, -3, 1, -4][frame_index]

    # Tail
    poly(
        draw,
        [(18, 40 + bob), (8, 34 + tail_angle), (11, 29 + tail_angle), (28, 36 + bob)],
        fur,
    )

    # Body and chest
    rect(draw, (26, 34 + bob, 88, 58 + bob), fur)
    rect(draw, (62, 36 + bob, 91, 60 + bob), dark)
    rect(draw, (33, 42 + bob, 74, 62 + bob), fur, width=1)

    # Neck, head, muzzle
    rect(draw, (82, 29 + bob, 96, 50 + bob), fur)
    rect(draw, (90, 22 + bob, 116, 45 + bob), fur)
    rect(draw, (108, 31 + bob, 124, 42 + bob), fur)
    rect(draw, (111, 35 + bob, 124, 42 + bob), dark, width=1)

    # Ear and eye
    poly(draw, [(92, 23 + bob), (83, 28 + bob), (86, 47 + bob), (97, 43 + bob)], dark)
    rect(draw, (107, 28 + bob, 111, 32 + bob), "#120812", width=1)

    # Collar
    rect(draw, (88, 45 + bob, 99, 51 + bob), collar, width=1)

    # Legs with four-frame alternating walk
    front_offset = [-4, 2, 4, -2][leg_phase]
    back_offset = [3, -3, -4, 2][leg_phase]
    mid_offset = [1, -2, 2, -1][leg_phase]

    rect(draw, (78 + front_offset, 56 + bob, 88 + front_offset, 79 + bob), dark)
    rect(draw, (82 + front_offset, 76 + bob, 99 + front_offset, 84 + bob), dark, width=1)
    rect(draw, (34 + back_offset, 56 + bob, 44 + back_offset, 79 + bob), dark)
    rect(draw, (27 + back_offset, 76 + bob, 44 + back_offset, 84 + bob), dark, width=1)
    rect(draw, (55 + mid_offset, 56 + bob, 65 + mid_offset, 78 + bob), dark)
    rect(draw, (56 + mid_offset, 75 + bob, 73 + mid_offset, 83 + bob), dark, width=1)

    return image.resize((FRAME[0] * SCALE, FRAME[1] * SCALE), Image.Resampling.NEAREST)


def save_strip(name, fur, dark, collar):
    frames = [draw_dog(fur, dark, collar, frame) for frame in range(4)]
    width, height = frames[0].size
    strip = Image.new("RGBA", (width * len(frames), height), (0, 0, 0, 0))
    for index, frame in enumerate(frames):
        strip.alpha_composite(frame, (index * width, 0))
    strip.save(OUT / name)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    save_strip("dog-chocolate-strip.png", "#6a3a22", "#3a1d12", "#ff8a00")
    save_strip("dog-fox-red-strip.png", "#c9652f", "#783315", "#7ce8ff")


if __name__ == "__main__":
    main()
