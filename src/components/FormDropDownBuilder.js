"use client"
import styles from "@/app/page.module.css"
export default function FormDropDownBuilder({ id, labelName, value, onChange, items }) {
  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}:</label>
      <select
        name={labelName}
        id={id}
        value={value}
        onChange={(e) => {
          let val = e.target.value;
          onChange(id, val);
        }}
      >
        {items.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    </div>
  );
}
