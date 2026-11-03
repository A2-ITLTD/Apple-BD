import Image from "next/image";

const STATIC_BANNERS = {
  help: {
    image: "/banner/Trusted Apple Gadgets in Bangladesh.png",
    alt: "Trusted Apple gadgets in Bangladesh with authentic products and fast delivery",
    className: "h-14 sm:h-28 md:h-32 lg:h-40 xl:h-52",
    imageClassName: "object-cover object-center",
  },
  "all-products": {
    image: "/banner/Explore Premium Apple Accessories.png",
    alt: "Explore premium Apple accessories and gadgets",
    className: "h-32 sm:h-44 md:h-52 lg:h-72 xl:h-[375px]",
    imageClassName: "object-cover object-[20%_center] sm:object-center",
  },
};

export default function PageBanner({ placement }) {
  const banner = STATIC_BANNERS[placement];
  if (!banner) return null;

  return (
    <section
      aria-label={banner.alt}
      className={`relative isolate w-full overflow-hidden rounded-2xl bg-[#E5E7EB] shadow-sm ${banner.className}`}
    >
      <Image
        src={encodeURI(banner.image)}
        alt={banner.alt}
        fill
        priority={placement === "all-products"}
        sizes="(max-width: 768px) 100vw, 1280px"
        className={banner.imageClassName}
      />
    </section>
  );
}
