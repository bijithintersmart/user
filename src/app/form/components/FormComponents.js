"use client";

import styles from "@/app/page.module.css";

export function FormDropDownBuilder({ id, labelName, value, onChange, items }) {
  return (
    <div className={styles.formField}>
      <label htmlFor={id}>{labelName}:</label>
      <select
        name={id}
        id={id}
        value={value}
        onChange={(e) => {
          let val = e.target.value;
          onChange(id, val);
        }}
      >
        <option value="" disabled>Select {labelName.toLowerCase()}</option>
        {items.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export function FormInputBuilder({ id, labelName, type, value, onChange, maxLength }) {
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
          onChange(id, val);
        }}
      />
    </div>
  );
}