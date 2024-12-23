import { useState, useEffect, useRef, useTransition } from "react";
import { classes, userProgress } from "@/database/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { deleteClass } from "@/database/classCrud";

type ClassCardProps = {
  currentClass: typeof classes.$inferSelect;
  isPending: boolean;
  updatingClassId: number | null;
  isEnrolled: (classId: number) => boolean | undefined;
  onClick: (id: number) => void;
  isHoveringActive: boolean;
  isHoveringEnrolled: boolean;
  activeClassId?: (typeof userProgress.$inferSelect)["activeClassId"];
  setIsHoveringActive: (state: boolean) => void;
  setIsHoveringEnrolled: (state: boolean) => void;
  isEdittable?: boolean;
};

function ClassCard({
  currentClass,
  isPending,
  updatingClassId,
  isEnrolled,
  onClick,
  isHoveringActive,
  isHoveringEnrolled,
  activeClassId,
  setIsHoveringActive,
  setIsHoveringEnrolled,
  isEdittable,
}: ClassCardProps) {
  
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isTransitionPending , startTransition] = useTransition();
  const router = useRouter();

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleDelete = () => {

    startTransition(() => {
      deleteClass(currentClass.id)
        .catch((err) => console.log(err))
        .finally(() => setShowMenu(false));
    });
  };

  const handleEdit = () => {
    router.push(`/classes/edit/${currentClass.id}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className="relative">
      {/* Dots menu appears when editable is true */}
      {isEdittable && (
        <div ref={menuRef} style={{ position: "absolute", top: "8px", left: "8px", zIndex:100  }} className="p-3 flex items-center justify-center">
          {/* Menu button (dots) */}
          <button
            onClick={toggleMenu}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              padding: "4px",
            }}
          >
            ⋮
          </button>

          {/* Dropdown menu */}
          {showMenu && !isTransitionPending && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                left: "0",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                borderRadius: "4px",
                width: "120px",
                zIndex: 110,
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "4px 0",
                  fontSize: "14px",
                }}
              >
                <li
                  onClick={() => {
                    setShowMenu(false);
                    // onEdit && onEdit();
                  }}
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  className=" hover:bg-slate-200 active:bg-slate-200 "
                >
                  Add chapter
                </li>
                <li
                  onClick={() => {
                    setShowMenu(false);
                    handleEdit();
                  }}
                  style={{
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                  className=" hover:bg-slate-200 active:bg-slate-200 "
                >
                  Edit
                </li>
                <li
                  onClick={() => {
                    setShowMenu(false);
                    handleDelete()
                  }}
                  style={{ padding: "8px 16px", cursor: "pointer" }}
                  className=" hover:bg-slate-200 active:bg-slate-200 "
                >
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {currentClass.id === activeClassId && isHoveringActive && (
        <motion.div
          className="pointer-events-none absolute z-100 -top-9 left-[53%] -translate-x-1/2 bg-sky-500 text-white text-sm px-3 py-1.5 rounded-[12px] shadow-sm text-nowrap break-words"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <div className="relative">
            {/* Sharper message tail */}
            <div className="absolute -bottom-[8px] right-[8px] w-4 h-4 bg-sky-500 transform rotate-45" />
            {/* Message content */}
            <p className="relative z-10">Class you're currently taking</p>
          </div>
        </motion.div>
      )}
      {isEnrolled(currentClass.id) &&
        currentClass.id !== activeClassId &&
        isHoveringEnrolled && (
          <motion.div
            className="pointer-events-none absolute z-100 -top-9 left-[60%] -translate-x-1/2 bg-sky-500 text-white text-sm px-3 py-1.5 rounded-[12px] shadow-sm whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            <div className="relative">
              {/* Sharper message tail */}
              <div className="absolute -bottom-[8px] right-[8px] w-4 h-4 bg-sky-500 transform rotate-45" />
              {/* Message content */}
              <p className="relative z-10">Class you're enrolled in</p>
            </div>
          </motion.div>
        )}
      <div
        onClick={() => onClick(currentClass.id)}
        onMouseEnter={() => {
          currentClass.id === activeClassId && setIsHoveringActive(true);
          isEnrolled(currentClass.id) &&
            currentClass.id !== activeClassId &&
            setIsHoveringEnrolled(true);
        }}
        onMouseLeave={() => {
          setIsHoveringActive(false);
          setIsHoveringEnrolled(false);
        }}
        className={cn(
          "relative h-full border-2 hover:bg-sky-500/5 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-[217px] min-w-[400px] rounded-xl hover:from-sky-200 hover:via-blue-200 hover:to-sky-300 hover:border-sky-400 transition-all duration-300 shadow-inner shadow-white/50 overflow-hidden group [&>*]:relative [&>*]:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
          currentClass.id === activeClassId
            ? "border-sky-500 bg-sky-500/10"
            : "border-slate-200",
          isEnrolled(currentClass.id) ? "border-sky-500" : "",
          isPending && "opacity-50 cursor-not-allowed"
        )}
      >
        {/* Checkmark and updating indicator */}
        <div className="min-h-[10px] w-full flex items-center justify-end">
          {currentClass.id === activeClassId && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
              <Check className="text-white stroke-[3] h-6 w-6" />
            </div>
          )}
          {currentClass.id !== activeClassId && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex border-2 border-sky-500 items-center justify-center" />
          )}
          {updatingClassId === currentClass.id && (
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-sky-500"></div>
          )}
        </div>
        <Image
          src={currentClass.imageSrc ?? ""}
          alt={currentClass.title ?? ""}
          height={70}
          width={93.3}
        />
        <p className="text-sky-700 text-center font-bold mt-3">
          {currentClass.title}
        </p>
      </div>
    </div>
  );
}

export default ClassCard;
