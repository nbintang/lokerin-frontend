import { cn } from "@/lib/utils";
import React from "react";

const GradientBorderButton = ({ children, ...props }: React.ComponentProps<"button">) => {
  return (
    <button className="group relative mx-auto cursor-pointer flex items-center w-full gap-3 justify-center rounded-md px-4 py-2 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] "{...props}>
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-md bg-gradient-to-r from-indigo-700 via-sky-400 to-indigo-600 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      {children}
    </button>
  );
};

export default GradientBorderButton;
