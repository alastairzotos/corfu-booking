import { ButtonProps } from "@mui/material";
import React from "react";

import styles from "components/lib/site/_core/shiny-button/glow-on-hover.module.css";

export const ShinyButton = (props: ButtonProps<"button">) => {
  return <button {...props} className={styles.glowOnHover} />;
};