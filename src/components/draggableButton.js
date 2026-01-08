"use client"

import * as motion from "motion/react-client"
import { useState } from "react"
import styles from "../app/page.module.css";

export default function DragButton() {
     const [activeDirection, setActiveDirection] = useState(null);

    return (
      <>
        <Line direction="x" activeDirection={activeDirection} />
        <Line direction="y" activeDirection={activeDirection} />
        <motion.div
          drag
          onDirectionLock={(direction) => setActiveDirection(direction)}
          onDragEnd={() => setActiveDirection(null)}
          dragConstraints={{ top: -40, right: 30, bottom: 30, left: 30 }}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          dragElastic={0.2}
          whileDrag={{ cursor: "grabbing" }}
          className={styles.box}
        />
      </>
    );
}

function Line({
    direction,
    activeDirection,
}) {
    return (
      <motion.div
        initial={false}
        animate={{ opacity: activeDirection === direction ? 1 : 0.3 }}
        transition={{ duration: 0.1 }}
        className={styles.line}
        style={{
          transform: direction === "y" ? "rotate(90deg)" : "rotate(0deg)",
          transformOrigin: "center",
        }}
      />
    );
}