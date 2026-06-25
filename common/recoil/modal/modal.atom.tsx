import { atom } from "recoil";

export const modalAtom = atom<{
  modal: JSX.Element | JSX.Element[];
  opened: boolean;
}>({
  key: "modal",
  default: {
    modal: <></>,
    opened: false,
  },
});
// note: tidy 17828389064661
