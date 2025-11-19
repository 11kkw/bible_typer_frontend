import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ΙΧΘΥΣ 말씀 타자",
    short_name: "말씀 타자",
    description: "성경 구절을 타자하며 통독을 이어갈 수 있는 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F9FA",
    theme_color: "#5EAAA8",
    icons: [
      {
        src: "/fish-symbol.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
