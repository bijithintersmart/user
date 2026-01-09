import FormDropDownBuilder from "@/components/FormDropDownBuilder";
import styles from "./GameModeSelector.module.css";

export default function GameModeSelector({ id, labelName, value, onChange, items }) {
  return (
    <div className={styles.gameModeContainer}>
      <FormDropDownBuilder 
        id={id}
        labelName={labelName}
        value={value}
        onChange={onChange}
        items={items}
      />
    </div>
  );
}