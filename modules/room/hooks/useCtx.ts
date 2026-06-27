import { useEffect, useState } from "react";

import { useRefs } from "./useRefs";

export const useCtx = () => {
  const { canvasRef } = useRefs();

  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const newCtx = canvasRef.current?.getContext("2d");

    if (newCtx) {
      newCtx.lineJoin = "round";
      newCtx.lineCap = "round";
      setCtx(newCtx);
    }
  }, [canvasRef]);

  return ctx;
};
// note: tidy 17828389061355
// note: tweak 17828389078401
