"use client";

import { useSelector } from "@legendapp/state/react";
import { useStateX } from "@packages/hooks";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import NavState from "@/states/nav-state";
import { useEffect, useRef } from "react";
import { categories } from "@/libs/utils";
// ? Uncomment the line below to start navigating to other routes, but make sure you have created all the necessary routes according to your needs beforehand.
// import routes from "@/libs/navigation";
import { m } from "motion/react";

function getElement(id: string) {
  return document.getElementById(id);
}

function getLastSection(url: string): string | undefined {
  const parts = url.split("/");
  const filteredParts = parts.filter((part) => part.length > 0);
  return filteredParts[filteredParts.length - 1];
}

export default function NavBar() {
  const { index, width, left, setIndex, setWidth, setLeft } = useSelector(NavState);
  const ScrollContainer = useRef<HTMLDivElement>(null);
  const ContainerView = useRef<HTMLElement>(null);
  // ? Uncomment the line below to start navigating to other routes, but make sure you have created all the necessary routes according to your needs beforehand. Also import useRouter from next/navigation.
  // const { push: navigate } = useRouter();
  const pathname = usePathname();

  const [hovered, setHovered] = useStateX<string | null>(null);

  const category = getLastSection(pathname);

  const isDesktop = useMediaQuery("(min-width:768px)");
  const AdjustSize = isDesktop ? 100 : 70;
  const AdjustDSize = isDesktop ? 125 : 80;

  const onClick = (idx: number) => () => {
    if (index != idx) {
      const PrevButton = getElement(`nav-button-id-${index}`);
      const NewButton = getElement(`nav-button-id-${idx}`);

      if (NewButton && ScrollContainer.current && ContainerView.current) {
        const NewButtonView = NewButton.getBoundingClientRect();
        if (PrevButton) {
          setIndex(idx);
          if (index < idx) {
            setLeft(PrevButton.offsetLeft + PrevButton.offsetWidth / 2);
            setWidth(NewButton.offsetWidth / 2 + NewButton.offsetLeft - PrevButton.offsetLeft - PrevButton.offsetWidth / 2);
          }
          if (index > idx) {
            setLeft(NewButton.offsetLeft + NewButton.offsetWidth / 2);
            setWidth(PrevButton.offsetLeft - NewButton.offsetLeft + PrevButton.offsetWidth / 2 - NewButton.offsetWidth / 2);
          }
          if (NewButtonView.left + NewButton.offsetWidth + AdjustSize > ContainerView.current.clientWidth) {
            ScrollContainer.current.scrollBy({
              left:
                NewButton.offsetLeft + NewButton.offsetWidth + AdjustDSize - ContainerView.current.clientWidth - ScrollContainer.current.scrollLeft,
              behavior: "smooth",
            });
          }
          if (NewButtonView.left - AdjustSize < 0) {
            ScrollContainer.current.scrollBy({
              left: NewButtonView.left - AdjustSize,
              behavior: "smooth",
            });
          }
        } else {
          setIndex(idx);
          setWidth(NewButton.offsetWidth);
          setLeft(NewButton.offsetLeft);
          if (NewButtonView.left + AdjustSize > ContainerView.current.clientWidth) {
            ScrollContainer.current.scrollBy({
              left: NewButtonView.left + NewButton.offsetWidth + AdjustDSize - ContainerView.current.clientWidth - ScrollContainer.current.scrollLeft,
              behavior: "smooth",
            });
          }
          if (NewButtonView.left - AdjustSize < 0) {
            ScrollContainer.current.scrollBy({
              left: NewButtonView.left - AdjustSize,
              behavior: "smooth",
            });
          }
        }
        // ? Uncomment the line below to start navigating to other routes, but make sure you have created all the necessary routes according to your needs beforehand.
        // navigate(NewButton.innerText.toLocaleLowerCase() === "home" ? routes.home : (NewButton.innerText.toLocaleLowerCase() as any));
      }
    }
  };

  const onAnimationComplete = () => {
    const Button = getElement(`nav-button-id-${index}`);
    if (Button) {
      if (Button.offsetLeft != left && Button.offsetWidth != width) {
        setLeft(Button.offsetLeft);
        setWidth(Button.offsetWidth);
      }
    }
  };

  useEffect(() => {
    const PreviousButton = getElement(`nav-button-id-${0}`);

    if (category) {
      const idx = categories.indexOf(category);
      const NewButton = getElement(`nav-button-id-${idx}`);

      if (NewButton && ScrollContainer.current && ContainerView.current) {
        const NewButtonView = NewButton.getBoundingClientRect();
        setIndex(idx);
        setWidth(NewButton.clientWidth);
        setLeft(NewButton.offsetLeft);
        if (NewButtonView.left + AdjustSize > ContainerView.current.clientWidth) {
          ScrollContainer.current.scrollBy({
            left: NewButtonView.left + NewButton.clientWidth + AdjustDSize - ContainerView.current.clientWidth - ScrollContainer.current.scrollLeft,
            behavior: "smooth",
          });
        }
        if (NewButtonView.left - AdjustSize < 0) {
          ScrollContainer.current.scrollBy({
            left: NewButtonView.left - AdjustSize,
            behavior: "smooth",
          });
        }
      }
    } else if (PreviousButton) {
      setIndex(0);
      setWidth(PreviousButton.clientWidth);
      setLeft(PreviousButton.offsetLeft);
    }
  }, []);

  return (
    <nav ref={ContainerView} className="flex w-screen flex-col pt-1.5">
      <div ref={ScrollContainer} className="hide-scrollbar relative mx-auto flex w-full flex-col overflow-x-scroll">
        <ul className="flex px-2 sm:px-5" onMouseLeave={() => setHovered(null)}>
          {categories.map((data, i) => {
            return (
              <li
                key={i}
                onClick={onClick(i)}
                id={`nav-button-id-${i}`}
                onMouseEnter={() => setHovered(data)}
                className={`${index === i ? "opacity-100" : "opacity-50 hover:opacity-100"} relative cursor-pointer px-2.25 py-1 text-[0.813rem] font-medium tracking-wide whitespace-nowrap capitalize transition-all duration-100 ease-in select-none sm:px-3 sm:py-1.5 sm:text-[0.938rem] dark:font-normal`}
              >
                {data}
                {hovered.peek === data && (
                  <m.span
                    layoutId="hover-background"
                    transition={{ type: "tween", duration: 0.3 }}
                    className="absolute inset-0 rounded-sm bg-black/7.5 max-sm:hidden dark:bg-white/10"
                  />
                )}
              </li>
            );
          })}
          <li className="-ml-2.5 w-5 flex-shrink-0 bg-transparent sm:w-7" />
        </ul>
        <m.span
          initial={{ width: 0, x: 0 }}
          animate={{ width, x: left }}
          onAnimationComplete={onAnimationComplete}
          transition={{ type: "tween", duration: 0.1 }}
          className="z-10 mt-1 h-0.75 rounded-t-full bg-black dark:h-0.5 dark:bg-white"
        />
      </div>
      <span className="-mt-px h-px w-full bg-black/12.5 dark:bg-white/12.5" />
    </nav>
  );
}
