from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def draw_boot_icon(size):
    scale = size / 128

    def s(value):
        return round(value * scale)

    image = Image.new("RGBA", (size, size), "#050014")
    draw = ImageDraw.Draw(image)

    # CRT-style glow plate.
    draw.rounded_rectangle(
        (s(8), s(8), s(120), s(120)),
        radius=s(16),
        fill="#13002d",
        outline="#0ff4ff",
        width=max(1, s(3)),
    )
    draw.rectangle((s(14), s(22), s(114), s(24)), fill="#6c2dff")
    draw.rectangle((s(14), s(102), s(114), s(104)), fill="#6c2dff")

    outline = "#080510"
    boot_dark = "#3f2817"
    boot_mid = "#6b4322"
    boot_light = "#9a642d"
    sole = "#1e130d"
    lace = "#ff8a00"

    # Pixel boot silhouette.
    boot = [
        (36, 22),
        (76, 22),
        (82, 30),
        (82, 66),
        (96, 69),
        (108, 78),
        (108, 96),
        (26, 96),
        (26, 78),
        (36, 72),
    ]
    draw.polygon([(s(x), s(y)) for x, y in boot], fill=outline)

    upper = [
        (40, 26),
        (72, 26),
        (78, 34),
        (78, 68),
        (38, 68),
        (38, 34),
    ]
    draw.polygon([(s(x), s(y)) for x, y in upper], fill=boot_mid)
    draw.rectangle((s(66), s(32), s(78), s(68)), fill=boot_dark)
    draw.rectangle((s(42), s(28), s(64), s(36)), fill=boot_light)

    foot = [
        (36, 68),
        (82, 68),
        (96, 72),
        (104, 80),
        (104, 92),
        (30, 92),
        (30, 80),
    ]
    draw.polygon([(s(x), s(y)) for x, y in foot], fill=boot_mid)
    draw.rectangle((s(72), s(72), s(100), s(86)), fill=boot_light)
    draw.rectangle((s(30), s(88), s(104), s(98)), fill=sole)
    draw.rectangle((s(22), s(92), s(110), s(102)), fill=outline)

    for x, y in [(46, 40), (58, 40), (46, 50), (58, 50), (46, 60), (58, 60)]:
        draw.rectangle((s(x), s(y), s(x + 5), s(y + 5)), fill=lace)

    draw.line([(s(50), s(42)), (s(68), s(62))], fill=outline, width=max(1, s(3)))
    draw.line([(s(62), s(42)), (s(44), s(62))], fill=outline, width=max(1, s(3)))

    return image


def main():
    PUBLIC.mkdir(exist_ok=True)
    for size in (32, 180, 192, 512):
        draw_boot_icon(size).save(PUBLIC / f"icon-{size}.png")


if __name__ == "__main__":
    main()
