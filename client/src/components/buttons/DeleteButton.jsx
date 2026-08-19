import { useRef } from "react";
import { Button } from "@/components/ui/button";
import TrashIcon from "@/components/icons/TrashIcon";

const DeleteButton = ({ onDelete, size = 18, className = "" }) => {
  const iconRef = useRef(null);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className={className}
    >
      <TrashIcon ref={iconRef} size={size} dangerHover shakeOnClick />
    </Button>
  );
};

export default DeleteButton;