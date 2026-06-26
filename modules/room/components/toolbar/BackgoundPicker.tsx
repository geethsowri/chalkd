import { CgScreen } from "react-icons/cg";

import { useModal } from "@/common/recoil/modal";

import BackgroundModal from "../../modals/BackgroundModal";

const BackgroundPicker = () => {
  const { openModal } = useModal();

  return (
    <button className="btn-icon" onClick={() => openModal(<BackgroundModal />)}>
      <CgScreen />
    </button>
  );
};

export default BackgroundPicker;
// note: clean 17828389051887
// note: update 17828389061647
// note: minor change to 17828389065779
