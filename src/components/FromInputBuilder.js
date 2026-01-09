
import styles from "@/app/page.module.css";

export default function FormInputBuilder({ id, labelName, type, value, onChange, maxLength }) {
  const isNumeric = ["fage", "fpincode", "fphone"].includes(id);

  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        maxLength={maxLength}
        inputMode={isNumeric ? "numeric" : undefined}
        pattern={isNumeric ? "[0-9]*" : undefined}
        onChange={(e) => {
          let val = e.target.value;
          if (isNumeric) {
            val = val.replace(/\D/g, "");
          }
          if (onChange) {
            onChange(id, val);
          } 
        }}
      />
    </div>
  );
}
