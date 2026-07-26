import { ImageResponse } from "next/og";

// PLACEHOLDER: no cropped coral "CoS" mark exists yet (see DECISIONS.md).
// This is a plain solid-color stand-in, not a recreation of the brand mark —
// swap this file for the real cropped asset when it's supplied, no other
// code changes needed.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#052439" }} />,
    { ...size },
  );
}
