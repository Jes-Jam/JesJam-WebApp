import { useState, useEffect, useRef, useTransition } from "react";
import { classes, userProgress } from "@/database/schema";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { hasChapters } from "@/database/chapterCrud";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onDelete: (classId: number) => void;
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
  onDelete,
}: ClassCardProps) {

  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();
  const [alreadyHasChapters, setAlreadyHasChapters] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


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

  useEffect(() => {
    hasChapters(currentClass.id).then((res) => {
      setAlreadyHasChapters(res);
    });
  }, [currentClass.id]);

  return (
    <div className="relative">
      {isEdittable && (
        <div className="absolute top-2 left-2 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-slate-100 rounded-full transition">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuItem
                onClick={() => onClick(currentClass.id)}
              >
                Start Learning
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`/classes/${currentClass.id}/chapters`)}
              >
                View chapters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(currentClass.id)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                Delete class
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
